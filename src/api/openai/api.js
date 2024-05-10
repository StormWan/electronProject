import { ChatGPTApi } from "./openai";
import { ModelProvider } from "./constant";

export class ClientApi {
  constructor(provider = ModelProvider.GPT) {
    switch (provider) {
      case ModelProvider.GPT:
        this.llm = new ChatGPTApi();
        break;
    }
  }

  config() {}

  prompts() {}

  masks() {}

  async share() {}
}
