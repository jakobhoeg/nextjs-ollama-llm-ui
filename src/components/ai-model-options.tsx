import React from 'react';

const modelOptions = [
    'deepseek-r1', 'llama3.3', 'phi4', 'llama3.2', 'llama3.1', 'nomic-embed-text', 'mistral', 'llama3', 'qwen',
    'gemma', 'qwen2', 'qwen2.5', 'llama2', 'phi3', 'llava', 'gemma2', 'qwen2.5-coder', 'codellama', 'tinyllama',
    'mxbai-embed-large', 'mistral-nemo', 'llama3.2-vision', 'starcoder2', 'snowflake-arctic-embed', 'mixtral',
    'deepseek-coder-v2', 'dolphin-mixtral', 'phi', 'codegemma', 'deepseek-coder', 'llama2-uncensored', 'wizardlm2',
    'dolphin-mistral', 'all-minilm', 'dolphin-llama3', 'bge-m3', 'llama2-chinese', 'smollm2', 'codegeex4', 'openchat',
    'aya', 'codeqwen', 'nous-hermes2', 'mistral-large', 'command-r-plus', 'stable-code', 'openhermes', 'tinydolphin',
    'deepseek-llm', 'glm4', 'wizardcoder', 'qwen2-math', 'bakllava', 'stablelm2', 'reflection', 'moondream', 'neural-chat',
    'llama3-gradient', 'wizard-math', 'deepseek-v2', 'llama3-chatqa', 'minicpm-v', 'sqlcoder', 'xwinlm', 'mistral-small',
    'nous-hermes', 'dolphincoder', 'phind-codellama', 'yarn-llama2', 'hermes3', 'solar', 'wizardlm', 'starling-lm',
    'yi-coder', 'llava-phi3', 'internlm2', 'athene-v2', 'falcon', 'falcon3', 'notux', 'open-orca-platypus2', 'shieldgemma',
    'notus', 'goliath', 'llama-guard3', 'bespoke-minicheck', 'nuextract', 'granite3.1-moe', 'opencoder', 'deepseek-v2.5',
    'snowflake-arctic-embed2', 'firefunction-v2', 'dbrx', 'paraphrase-multilingual', 'alfred', 'olmo2', 'exaone3.5',
    'tulu3', 'command-r7b', 'granite-embedding', 'granite3-guardian', 'sailor2'
];

const AiModelOptions = ({ searchTerm }: { searchTerm: string }) => {
    const filteredOptions = modelOptions.filter((model) =>
        model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const optionsToShow = filteredOptions.length > 0 ? filteredOptions.slice(0, 5) : modelOptions.slice(0, 5);

    return (
        <datalist id="model-options">
            {optionsToShow.map((model, index) => (
                <option key={index} value={model} />
            ))}
        </datalist>
    );
};

export default AiModelOptions;