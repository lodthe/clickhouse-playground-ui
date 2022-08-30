.PHONY: docker-publish-x86

docker-publish-x86:
	docker buildx build --platform linux/x86_64 --build-arg API_URL=https://fiddle.clickhouse.com/api/ -t lodthe/clickhouse-playground-ui .
	docker push lodthe/clickhouse-playground-ui
	
	@echo "Image has been published"
