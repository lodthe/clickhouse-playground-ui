.PHONY: docker-publish-x86

docker-publish-x86:
	docker buildx build --platform linux/x86_64 -t lodthe/clickhouse-playground-ui .
	docker push lodthe/clickhouse-playground-ui
	@echo "Image has been published"
