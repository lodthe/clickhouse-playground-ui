.PHONY: docker-publish-x86

export COMMIT_HASH := $(shell git rev-parse --short HEAD)

docker-publish-x86:
	@echo "Commit hash: ${COMMIT_HASH}"

	docker buildx build --platform linux/x86_64 --build-arg API_URL=https://fiddle.clickhouse.com/api/ -t "lodthe/clickhouse-playground-ui${COMMIT_HASH}" .
	docker push "lodthe/clickhouse-playground-ui${COMMIT_HASH}"
	
	@echo "Image has been published"
