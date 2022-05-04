export type GetTagsResponse = {
  tags: string[];
}

export type GetQueryRunResponse = {
  input: string;
  output: string;
  queryRunId: string;
}

export type RunQueryResponse = {
  queryRunId: string;
  output: string;
  timeElapsed: string;
}

export class Client {
  apiBaseUrl: string;

  constructor(apiUrl: string) {
    this.apiBaseUrl = apiUrl;
  }

  public getTags(): Promise<GetTagsResponse> {
    return fetch(this.apiBaseUrl + 'tags')
      .then(response => response.json())
      .then(response => {
        if (response.result) {
          return {
            tags: response.result.tags,
          };
        } else {
          throw Error(response.error.message);
        }
      })
      .catch(error => {
        throw error;
      });
  }

  public runQuery(query: string, version: string): Promise<RunQueryResponse> {
    const requestMetadata = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query,
        version: version,
      }),
    };

    return fetch(this.apiBaseUrl + 'runs', requestMetadata)
      .then(response => response.json())
      .then(response => {
        if (response.result) {
          return {
            queryRunId: response.result.query_run_id,
            output: response.result.output,
            timeElapsed: response.result.time_elapsed,
          };
        } else {
          throw Error(response.error.message);
        }
      })
      .catch(error => {
        throw error;
      });
  }

  public getQueryRun(id: string): Promise<GetQueryRunResponse> {
    return fetch(this.apiBaseUrl + 'runs/' + id)
      .then(response => response.json())
      .then(response => {
        if (response.result) {
          return {
            input: response.result.input,
            output: response.result.output,
            queryRunId: response.result.query_run_id,
          };
        } else {
          throw Error(response.error.message);
        }
      })
      .catch(error => {
        throw error;
      });
  }
}