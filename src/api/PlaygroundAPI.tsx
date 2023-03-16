import posthog from 'posthog-js';

export type GetTagsResponse = {
  tags: string[];
};

export type GetQueryRunResponse = {
  version: string;
  input: string;
  output: string;
  queryRunId: string;
};

export type RunQueryResponse = {
  queryRunId: string;
  output: string;
  timeElapsed: string;
};

export class Client {
  apiBaseUrl: string;

  constructor(apiUrl: string) {
    this.apiBaseUrl = apiUrl;
  }

  public getTags(): Promise<GetTagsResponse> {
    posthog.capture('api: getTags');

    return fetch(`${this.apiBaseUrl}tags`)
      .then((response) => response.json())
      .then((response) => {
        if (response.result) {
          return {
            tags: response.result.tags,
          };
        }
        throw Error(response.error.message);
      })
      .catch((error) => {
        throw error;
      });
  }

  public runQuery(query: string, version: string): Promise<RunQueryResponse> {
    posthog.capture('api: runQuery', { version });

    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        version,
      }),
    };

    return fetch(`${this.apiBaseUrl}runs`, requestMetadata)
      .then((response) => response.json())
      .then((response) => {
        if (response.result) {
          return {
            queryRunId: response.result.query_run_id,
            output: response.result.output,
            timeElapsed: response.result.time_elapsed,
          };
        }
        throw Error(response.error.message);
      })
      .catch((error) => {
        throw error;
      });
  }

  public getQueryRun(id: string): Promise<GetQueryRunResponse> {
    posthog.capture('api: getQueryRun', { id });

    return fetch(`${this.apiBaseUrl}runs/${id}`)
      .then((response) => response.json())
      .then((response) => {
        if (response.result) {
          return {
            version: response.result.version,
            input: response.result.input,
            output: response.result.output,
            queryRunId: response.result.query_run_id,
          };
        }
        throw Error(response.error.message);
      })
      .catch((error) => {
        throw error;
      });
  }
}
