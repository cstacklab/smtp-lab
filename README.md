# SMTP Lab

SMTP Lab is a local-only Docker Compose collection for testing application email without sending real messages. It focuses on day-to-day development workflows: start an SMTP catcher, point your app at it, inspect the captured email in a browser, and reset everything when you are done.

This repo includes three local recipes:

| Recipe | Compose file | Best for |
| --- | --- | --- |
| Mailpit basic | `compose.yaml` | Default local development inbox |
| Mailpit advanced | `compose.mailpit.advanced.yaml` | Authenticated local SMTP and protected web UI |
| MailDev basic | `compose.maildev.basic.yaml` | Simple MailDev-compatible projects |

The Mailpit examples are based on the referenced `mail1` and `mail3` layouts from [SMTP-For-DEV-And-QA-Using-Docker-Compose](https://github.com/meibraransari/SMTP-For-DEV-And-QA-Using-Docker-Compose), cleaned up for a professional local-development repo.

## Requirements

- Docker
- Docker Compose V2
- Node.js 18+ only for the included SMTP smoke-test script

## Mailpit Basic

Start the default Mailpit stack:

```bash
docker compose up -d
```

Open the inbox:

```text
http://localhost:8025
```

Configure an app running on your host:

```text
SMTP host: localhost
SMTP port: 1025
TLS: off
Username: any value or empty
Password: any value or empty
```

Configure an app running in another container on the same Compose network:

```text
SMTP host: mailpit
SMTP port: 1025
TLS: off
```

Send a test email:

```bash
make test-email
```

## Mailpit Advanced

The advanced stack adds file-based SMTP authentication and web UI authentication.

Start it:

```bash
docker compose -f compose.mailpit.advanced.yaml up -d
```

Open the inbox:

```text
http://localhost:8026
```

Default web UI users are defined in [configs/mailpit/ui-auth.txt](/Users/chathuranga/repos/smtp-lab/configs/mailpit/ui-auth.txt):

```text
admin / admin123
developer / developer123
viewer / viewer123
```

Configure an app running on your host:

```text
SMTP host: localhost
SMTP port: 1026
TLS: off
Username: developer
Password: developer123
```

Configure an app running in another container on the same Compose network:

```text
SMTP host: mailpit
SMTP port: 1025
TLS: off
Username: developer
Password: developer123
```

Send an authenticated test email:

```bash
make test-email-advanced
```

SMTP users are defined in [configs/mailpit/smtp-auth.txt](/Users/chathuranga/repos/smtp-lab/configs/mailpit/smtp-auth.txt).

## MailDev Basic

Start the MailDev stack:

```bash
docker compose -f compose.maildev.basic.yaml up -d
```

Open the inbox:

```text
http://localhost:1080
```

Configure an app running on your host:

```text
SMTP host: localhost
SMTP port: 1027
TLS: off
Username: leave empty
Password: leave empty
```

Configure an app running in another container on the same Compose network:

```text
SMTP host: maildev
SMTP port: 1025
TLS: off
```

Send a test email:

```bash
make test-email-maildev
```

## Ports

| Recipe | Web UI | Host SMTP | Container SMTP |
| --- | --- | --- | --- |
| Mailpit basic | `8025` | `1025` | `1025` |
| Mailpit advanced | `8026` | `1026` | `1025` |
| MailDev basic | `1080` | `1027` | `1025` |

The different host SMTP ports let you run the recipes side by side if needed.

## Environment

Copy the example environment file to customize ports:

```bash
cp .env.example .env
```

Then edit `.env` and restart the relevant stack.

## Make Commands

```bash
make up
make down
make logs
make mailpit-advanced-up
make mailpit-advanced-down
make maildev-up
make maildev-down
make test-email
make test-email-advanced
make test-email-maildev
```

## Reset Data

Mailpit basic:

```bash
docker compose down -v
```

Mailpit advanced:

```bash
docker compose -f compose.mailpit.advanced.yaml down -v
```

MailDev basic:

```bash
docker compose -f compose.maildev.basic.yaml down -v
```

## Local Development Only

This repository is intentionally scoped to local development. It is not a production mail server and does not configure DNS, MX records, SPF, DKIM, DMARC, public TLS, spam filtering, or real outbound delivery.

For production email, use a managed provider or a purpose-built production mail stack.
