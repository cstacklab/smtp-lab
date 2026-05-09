.PHONY: up down logs mailpit-up mailpit-down mailpit-logs mailpit-advanced-up mailpit-advanced-down mailpit-advanced-logs maildev-up maildev-down maildev-logs test-email test-email-advanced test-email-maildev config mailpit-advanced-config maildev-config

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f mailpit

mailpit-up: up

mailpit-down: down

mailpit-logs: logs

mailpit-advanced-up:
	docker compose -f compose.mailpit.advanced.yaml up -d

mailpit-advanced-down:
	docker compose -f compose.mailpit.advanced.yaml down

mailpit-advanced-logs:
	docker compose -f compose.mailpit.advanced.yaml logs -f mailpit

maildev-up:
	docker compose -f compose.maildev.basic.yaml up -d

maildev-down:
	docker compose -f compose.maildev.basic.yaml down

maildev-logs:
	docker compose -f compose.maildev.basic.yaml logs -f maildev

test-email:
	node examples/send-test-email.mjs

test-email-advanced:
	SMTP_PORT=1026 SMTP_USERNAME=developer SMTP_PASSWORD=developer123 node examples/send-test-email.mjs

test-email-maildev:
	SMTP_PORT=1027 node examples/send-test-email.mjs

config:
	docker compose config

mailpit-advanced-config:
	docker compose -f compose.mailpit.advanced.yaml config

maildev-config:
	docker compose -f compose.maildev.basic.yaml config
