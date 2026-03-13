# TracIT Platform Architecture

<p align="center">
  <img src="docs/tracit-architecture.png" width="900">
</p>

**A containerized, multi-service job tracking platform demonstrating a full DevOps and cloud infrastructure stack — from self-hosted Docker to Azure Hub-and-Spoke VNet design.**

[Terraform] [Azure] [Docker] [Cloudflare]
[![Terraform](https://img.shields.io/badge/IaC-Terraform-7B42BC?logo=terraform&logoColor=white)](https://terraform.io)
[![Azure](https://img.shields.io/badge/Cloud-Azure-0078D4?logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com)
[![Docker](https://img.shields.io/badge/Containers-Docker-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![Cloudflare](https://img.shields.io/badge/DNS%2FSSL-Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://cloudflare.com)

---

## Key Architecture Goals

• Demonstrate a full DevOps platform lifecycle from self-hosted infrastructure to cloud deployment.

• Use containerized microservices to separate frontend, API, automation, and persistence layers.

• Implement secure ingress using Cloudflare edge protection and reverse proxy routing.

• Design a cloud-ready topology based on Azure Hub-and-Spoke networking with private endpoints.

• Manage infrastructure with Terraform and CI/CD pipelines via GitHub Actions.

• Maintain portability between on-prem Docker environments and Azure container services.

## Overview

TracIT is a containerized multi-service platform built on a Synology NAS and designed for migration to Azure. It demonstrates a complete production-pattern infrastructure: Cloudflare edge → reverse proxy → Docker bridge network → PostgreSQL + Redis persistence + n8n workflow automation. The Azure target architecture follows a **Hub-and-Spoke VNet model** with centralized firewall egress, private endpoints for all data layer services, and Terraform-managed infrastructure. CI/CD is implemented via GitHub Actions with staging gates and container image promotion through Azure Container Registry.

---

## Architecture

```
Internet → Cloudflare (DNS + SSL + DDoS) → Synology NAS Firewall + DDNS
        → DSM Reverse Proxy (hostname routing) → Docker Host (tracit_net 172.20.0.0/24)
              ├── Frontend     Next.js      :3000
              ├── Backend API  Node.js      :5200
              ├── Automation   n8n          :5678
              ├── Database     PostgreSQL   :5432  (internal only)
              └── Cache        Redis        :6379  (internal only)
```

**Azure Target (Hub-and-Spoke)**

```
Cloudflare → Azure Front Door (WAF + Global LB)
           → Hub VNet 10.0.0.0/16  [Azure Firewall · Bastion · VPN Gateway]
                  ├── App Spoke 10.1.0.0/16  [Frontend ACI · API ACI · n8n ACI]
                  └── Data Spoke 10.2.0.0/16 [PostgreSQL Flexible · Redis Cache]
                                              (Private Endpoints, no public access)
```

All cross-spoke traffic is force-tunneled through the hub firewall via User-Defined Routes (UDRs). On-premises connectivity to Azure via Site-to-Site VPN for the hybrid migration window.

---

## Design Decisions

**Hub-and-Spoke over flat VNet**
- Single firewall inspection point for all egress; mirrors enterprise Cloud Adoption Framework patterns
- 10.x.0.0/16 increments per spoke — non-overlapping, room to expand without redesigning

**NVA over Azure Firewall**
- Azure Firewall costs ~$140/mo — overkill for a portfolio project
- Hardened Ubuntu 22.04 VM (B1s, ~$8/mo) with `iptables` masquerading and Kernel IP Forwarding achieves the same forced-egress result at a fraction of the cost

**Private Endpoints for PostgreSQL, Service Endpoints for Key Vault**
- PostgreSQL: Private Endpoint ($7.50/mo) — data layer warrants maximum isolation
- Key Vault: Service Endpoint + VNet ACLs (free) — access restricted to hub and compute subnets; acceptable tradeoff at this stage

**Cloudflare in front of everything**
- Real home IP never exposed; Cloudflare absorbs DDoS at the edge
- Full (Strict) SSL mode — encrypted on both legs, origin validated via Let's Encrypt cert on DSM

**Docker Compose over Kubernetes**
- Five services on a single host; Kubernetes overhead is not justified
- Custom named bridge network (`tracit_net`) required for container DNS resolution — default bridge does not support it

**n8n for automation**
- Self-hostable, visual workflow editor, broad integration support
- Faster iteration on automation workflows than custom Node.js scripts

---

## Lessons Learned

**Asymmetric routing in Hub-and-Spoke**
- Ping worked Hub → Spoke but failed Spoke → Hub
- Root cause: missing return route in the Hub route table; NVA received the packet but had no path back to the specific Spoke subnet
- Fix: added explicit return routes; now use Azure Effective Routes to validate hop-by-hop before assuming misconfiguration

**Docker container DNS only works on user-defined networks**
- Default bridge network does not support service discovery by container name
- Wasted half a day debugging connection refused errors; solution is always define a named network in `docker-compose.yml`

**Azure subnet naming is non-negotiable**
- Azure Firewall requires `AzureFirewallSubnet`, Bastion requires `AzureBastionSubnet`, VPN Gateway requires `GatewaySubnet`
- Spent an hour on failed deployments before finding this; subnet names are validated before resource creation

**Overlapping VNet address spaces break peering**
- Initially designed two spokes with overlapping `10.0.x.x` ranges
- Azure blocks peering of overlapping VNets; required destroying and recreating both VNets
- Lesson: plan the full IP address space on paper before creating any VNet

**SSL mode confusion with Cloudflare**
- Flexible mode encrypts user → Cloudflare only; origin leg is plain HTTP
- Full (Strict) requires a valid cert on the origin; switching modes without one causes handshake failures
- Lesson: understand all three modes before enabling anything

**Docker volume loss from `down -v`**
- `docker compose down -v` deletes named volumes; ran it by accident and lost a week of test data
- Now: `pg_dump` runs on cron nightly, output stored off the Docker host

---

## Deployment and Usage

**Local (Docker Compose)**

```bash
git clone https://github.com/yourusername/tracit-platform.git
cd tracit-platform
cp docker/.env.example docker/.env   # fill in secrets
docker compose -f docker/docker-compose.yml up -d
docker compose ps                    # verify all services healthy
```

Services: Frontend `:3000` · API `:5200` · n8n `:5678`

**Azure Infrastructure (Terraform)**

```bash
cd terraform
export TF_VAR_postgres_admin_password="your-password"
terraform init
terraform plan -var="environment=staging" -out=tfplan
terraform apply tfplan
```

**CI/CD Pipeline** — GitHub Actions triggers on push:

| Event | Pipeline |
|---|---|
| Push to any branch | Lint → Unit tests → Docker build → Trivy scan |
| Merge to `main` | Push image to ACR (SHA tag) → Deploy staging → Smoke tests → Manual approval → Deploy prod |

Rollback: redeploy previous image SHA tag from ACR.

---

## Cost Breakdown

**Current (Self-Hosted)**

| Component | Cost |
|---|---|
| Synology NAS power (~15W) | ~$2/mo |
| Domain + Cloudflare Free | ~$1/mo |
| **Total** | **~$3/mo** |

**Azure Target (Basic, Single-Region)**

| Component | SKU | Cost |
|---|---|---|
| NVA (Ubuntu B1s) | Standard_B1s | ~$8/mo |
| Azure Container Instances (×3 services) | 1 vCPU / 1.5GB each | ~$88/mo |
| Azure Database for PostgreSQL | Burstable B1ms | ~$15/mo |
| Azure Cache for Redis | C0 Basic | ~$16/mo |
| Application Gateway | Small | ~$25/mo |
| Azure Container Registry | Basic | ~$5/mo |
| Storage + Networking | — | ~$5/mo |
| **Total (Basic)** | | **~$162/mo** |

**Cost decisions:** NVA instead of Azure Firewall saves ~$132/mo. Key Vault Service Endpoint instead of Private Endpoint saves $7.50/mo. Spot instances for ephemeral compute workloads provide ~90% discount on node costs.

---

## Roadmap

**Part I — Always-On Infrastructure**

- [x] Phase 1: Budget alerts and monthly spend caps
- [x] Phase 2: Hub VNet + hardened Ubuntu NVA + Log Analytics
- [x] Phase 3: Data Spoke VNet + Key Vault (Service Endpoint)
- [ ] Phase 4: Management access — Azure Bastion + dedicated Jumpbox VM *(on hold: regional service degradation)*
- [ ] Phase 5: Azure Policy — allowed VM SKUs, location locks, resource locks on persistent layers
- [ ] Phase 6: Azure Container Registry (Service Endpoint, locked to Compute Spoke subnet)
- [ ] Phase 7: Azure PostgreSQL Flexible Server (Private Endpoint)

**Part II — Ephemeral Compute**

- [ ] Phase 8: Containerize application with Azure SQL driver support
- [ ] Phase 9: K3s cluster on Azure Spot Instances — Master + Worker, outbound via Hub NVA
- [ ] Phase 10: GitHub Actions scheduled CI/CD — deploy at trigger, tear down after run; automatic fallback from Spot to On-Demand on capacity failure

**Part III — Observability and HA**

- [ ] Centralized logging — Azure Monitor + structured JSON from all services
- [ ] Application Insights — distributed tracing across Frontend → API → DB
- [ ] Zone-redundant PostgreSQL (primary + standby across AZs)
- [ ] Azure Front Door replacing App Gateway — WAF + global anycast
- [ ] Terraform remote state — Azure Blob Storage backend with state locking
- [ ] Azure Key Vault for secret rotation (replacing static `.env` secrets)

---

*Infrastructure as Code: [`terraform/`](./terraform/) · Docker Compose: [`docker/`](./docker/) · CI/CD: [`.github/workflows/`](./.github/workflows/)*
