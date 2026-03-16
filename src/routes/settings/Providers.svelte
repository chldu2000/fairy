<script lang="ts">
    import type { Provider } from '$lib/types';
    import type { SvelteMap } from 'svelte/reactivity';
    import { saveProvider, deleteProvider } from '$lib/store.svelte';
    import { ProviderType } from '$lib/types';
    import { providerApiEndpoints } from '$lib/constants';
    import FButton from '$lib/widgets/FButton.svelte';

    type Props = {
        providers: SvelteMap<string, Provider>;
    };

    let { providers }: Props = $props();

    // 状态管理
    let isFormVisible = $state(false);
    let isEditing = $state(false);
    let editingName = ''; // 用于编辑时存储原始名称
    let showDeleteConfirm = $state(false);
    let providerToDelete = $state('');
    let apiTypeDropdownOpen = $state(false);

    // 初始化表单数据的函数
    function initFormData(
        apiType: ProviderType = ProviderType.OpenAICompatible,
    ): Provider {
        return {
            name: '',
            apiType,
            baseUrl: providerApiEndpoints[apiType].baseUrl,
            endpoint: providerApiEndpoints[apiType].endpoint,
            apiKey: null,
            model: '',
        };
    }

    // 表单数据
    let formData: Provider = $state(initFormData()) as Provider;

    // 验证错误
    let errors: Partial<Record<keyof Provider, string>> = $state({}) as Partial<
        Record<keyof Provider, string>
    >;

    // 监听 apiType 变化，自动填充默认值
    function handleApiTypeChange() {
        if (formData.apiType && providerApiEndpoints[formData.apiType]) {
            const defaults = providerApiEndpoints[formData.apiType];
            // 仅在新增模式或 baseUrl 为空时填充
            if (!isEditing || !formData.baseUrl) {
                formData.baseUrl = defaults.baseUrl;
            }
            // 仅在新增模式或 endpoint 为空时填充
            if (!isEditing || !formData.endpoint) {
                formData.endpoint = defaults.endpoint;
            }
        }
    }

    // 打开新增表单
    function openAddForm() {
        isEditing = false;
        editingName = '';
        formData = initFormData();
        errors = {};
        isFormVisible = true;
    }

    // 打开编辑表单
    function openEditForm(name: string) {
        const provider = providers.get(name);
        if (provider) {
            isEditing = true;
            editingName = name;
            formData = { ...provider };
            errors = {};
            isFormVisible = true;
        }
    }

    // 验证表单
    function validateForm(): boolean {
        const newErrors: Partial<Record<keyof Provider, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = '名称不能为空';
        } else if (
            (!isEditing || formData.name !== editingName) &&
            providers.has(formData.name)
        ) {
            newErrors.name = 'Provider 名称已存在';
        }

        if (!formData.baseUrl.trim()) {
            newErrors.baseUrl = 'Base URL 不能为空';
        } else {
            try {
                new URL(formData.baseUrl);
            } catch {
                newErrors.baseUrl = '请输入有效的 URL';
            }
        }

        if (!formData.endpoint.trim()) {
            newErrors.endpoint = 'Endpoint 不能为空';
        }

        if (!formData.model.trim()) {
            newErrors.model = 'Model 不能为空';
        }

        errors = newErrors;
        return Object.keys(newErrors).length === 0;
    }

    // 提交表单
    async function handleSubmit() {
        if (validateForm()) {
            try {
                await saveProvider(formData);
                isFormVisible = false;
                // 如果是编辑模式且名称改变，需要删除旧记录
                if (isEditing && formData.name !== editingName) {
                    await deleteProvider(editingName);
                }
            } catch (error) {
                console.error('Error saving provider:', error);
                alert('保存失败，请重试');
            }
        }
    }

    // 取消表单
    function handleCancel() {
        isFormVisible = false;
    }

    // 打开删除确认
    function openDeleteConfirm(name: string) {
        providerToDelete = name;
        showDeleteConfirm = true;
    }

    // 取消删除
    function cancelDelete() {
        showDeleteConfirm = false;
        providerToDelete = '';
    }

    // 确认删除
    async function confirmDelete() {
        try {
            await deleteProvider(providerToDelete);
            showDeleteConfirm = false;
            providerToDelete = '';
        } catch (error) {
            console.error('Error deleting provider:', error);
            alert('删除失败，请重试');
        }
    }

    // 点击外部关闭下拉菜单
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('#apiType-select')) {
            apiTypeDropdownOpen = false;
        }
    }

    // 只在浏览器环境中监听点击事件
    if (typeof window !== 'undefined') {
        window.addEventListener('click', handleClickOutside);
    }
</script>

<div class="providers-container">
    <!-- 操作栏 -->
    <div class="action-bar">
        <FButton onclick={openAddForm}>新增 Provider</FButton>
    </div>

    <!-- Provider 列表 -->
    <div class="provider-list">
        {#each providers.entries() as [name, provider] (name)}
            <div class="provider-item">
                <div class="provider-info">
                    <div class="provider-name">{name}</div>
                    <div class="provider-details">
                        <span>Type: {provider.apiType}</span>
                        <span>URL: {provider.baseUrl}{provider.endpoint}</span>
                        <span>Model: {provider.model}</span>
                    </div>
                </div>
                <div class="provider-actions">
                    <FButton onclick={() => openEditForm(name)}>编辑</FButton>
                    <FButton onclick={() => openDeleteConfirm(name)}>删除</FButton>
                </div>
            </div>
        {/each}
    </div>

    <!-- 表单区域 -->
    {#if isFormVisible}
        <div
            class="form-overlay"
            onclick={handleCancel}
            aria-hidden="true"
        ></div>
        <div class="form-container">
            <div class="form-header">
                <h2>{isEditing ? '编辑 Provider' : '新增 Provider'}</h2>
            </div>
            <form
                class="provider-form"
                onsubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div class="form-field">
                    <label for="name">名称 *</label>
                    <input
                        id="name"
                        type="text"
                        bind:value={formData.name}
                        placeholder="输入 Provider 名称"
                    />
                    {#if errors.name}
                        <span class="error">{errors.name}</span>
                    {/if}
                </div>

                <div class="form-field">
                    <label for="apiType">API 类型 *</label>
                    <div id="apiType-select" class="dropdown-container">
                        <div class="dropdown">
                            <button
                                type="button"
                                class="dropdown-button"
                                onclick={() => apiTypeDropdownOpen = !apiTypeDropdownOpen}
                                aria-haspopup="true"
                                aria-expanded={apiTypeDropdownOpen}
                            >
                                <span class="button-text">{formData.apiType}</span>
                                <span class={"arrow " + (apiTypeDropdownOpen ? 'rotated' : '')}>&#9660;</span>
                            </button>
                            {#if apiTypeDropdownOpen}
                                <ul class="dropdown-list" role="listbox">
                                    {#each Object.values(ProviderType) as apiType (apiType)}
                                        <li
                                            class="dropdown-item {apiType === formData.apiType ? 'selected' : ''}"
                                            role="option"
                                            aria-selected={apiType === formData.apiType}
                                            onclick={() => {
                                                formData.apiType = apiType;
                                                apiTypeDropdownOpen = false;
                                                handleApiTypeChange();
                                            }}
                                            onkeydown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    formData.apiType = apiType;
                                                    apiTypeDropdownOpen = false;
                                                    handleApiTypeChange();
                                                }
                                            }}
                                            tabIndex="0"
                                        >
                                            {apiType}
                                        </li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    </div>
                </div>

                <div class="form-field">
                    <label for="baseUrl">Base URL *</label>
                    <input
                        id="baseUrl"
                        type="text"
                        bind:value={formData.baseUrl}
                        placeholder="https://api.example.com"
                    />
                    {#if errors.baseUrl}
                        <span class="error">{errors.baseUrl}</span>
                    {/if}
                </div>

                <div class="form-field">
                    <label for="endpoint">Endpoint *</label>
                    <input
                        id="endpoint"
                        type="text"
                        bind:value={formData.endpoint}
                        placeholder="/v1/chat/completions"
                    />
                    {#if errors.endpoint}
                        <span class="error">{errors.endpoint}</span>
                    {/if}
                </div>

                <div class="form-field">
                    <label for="apiKey">API Key</label>
                    <input
                        id="apiKey"
                        type="password"
                        bind:value={formData.apiKey}
                        placeholder="可选"
                    />
                </div>

                <div class="form-field">
                    <label for="model">Model *</label>
                    <input
                        id="model"
                        type="text"
                        bind:value={formData.model}
                        placeholder="例如: gpt-3.5-turbo"
                    />
                    {#if errors.model}
                        <span class="error">{errors.model}</span>
                    {/if}
                </div>

                <div class="form-actions">
                    <FButton type="submit">保存</FButton>
                    <FButton type="button" onclick={handleCancel}>取消</FButton>
                </div>
            </form>
        </div>
    {/if}

    <!-- 删除确认对话框 -->
    {#if showDeleteConfirm}
        <div
            class="form-overlay"
            onclick={cancelDelete}
            aria-hidden="true"
        ></div>
        <div class="confirm-dialog">
            <div class="confirm-header">
                <h3>确认删除</h3>
            </div>
            <div class="confirm-body">
                <p>确定要删除 Provider "{providerToDelete}" 吗？</p>
                <p class="warning">此操作无法撤销。</p>
            </div>
            <div class="confirm-actions">
                <FButton onclick={confirmDelete}>删除</FButton>
                <FButton onclick={cancelDelete}>取消</FButton>
            </div>
        </div>
    {/if}
</div>

<style>
    .providers-container {
        padding: 1rem;
    }

    .action-bar {
        margin-bottom: 1rem;
    }

    .provider-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .provider-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #2f2f2f;
        border: grey 3px solid;
        border-radius: 1.25rem;
        transition: all 0.2s ease;
    }

    .provider-item:hover {
        border-color: #9bbe00;
        box-shadow: 0 0 0 3px rgba(155, 190, 0, 0.2);
    }

    .provider-info {
        flex: 1;
    }

    .provider-name {
        color: white;
        font-weight: bold;
        margin-bottom: 0.25rem;
        font-size: 1.1rem;
    }

    .provider-details {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        color: grey;
    }

    .provider-actions {
        display: flex;
        gap: 0.5rem;
    }

    .form-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }

    .form-container,
    .confirm-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #1a1a1a;
        border: grey 3px solid;
        border-radius: 1.25rem;
        padding: 1.5rem;
        width: 90%;
        max-width: 500px;
        z-index: 101;
    }

    .confirm-dialog {
        max-width: 400px;
    }

    .form-header h2,
    .confirm-header h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: white;
    }

    .provider-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .form-field label {
        font-weight: bold;
        color: white;
    }

    .form-field input {
        padding: 0.5rem 1rem;
        border: grey 2px solid;
        border-radius: 1rem;
        font-size: 1rem;
        font-family: inherit;
        background-color: #2f2f2f;
        color: white;
        transition: all 0.2s ease;
    }

    .form-field input:focus {
        outline: none;
        border-color: #9bbe00;
        box-shadow: 0 0 0 2px rgba(155, 190, 0, 0.3);
    }

    .error {
        color: #ff4d4f;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }

    .form-actions,
    .confirm-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .confirm-body {
        margin-bottom: 1.5rem;
    }

    .confirm-body p {
        color: white;
        margin: 0.5rem 0;
    }

    .confirm-body p.warning {
        color: #faad14;
        font-weight: bold;
    }

    /* Custom dropdown styles */
    .dropdown-container {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .dropdown-button {
        background-color: #2f2f2f;
        color: white;
        border-radius: 1rem;
        border: grey 2px solid;
        height: 2.5rem;
        padding-left: 1.25rem;
        padding-right: 0.75rem;
        cursor: pointer;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        display: inline-flex;
        align-items: center;
        min-width: 10rem;
        justify-content: space-between;
    }

    .button-text {
        flex: 1;
        text-align: left;
    }

    .arrow {
        font-size: 0.75em;
        transition: transform 0.2s ease;
    }

    .arrow.rotated {
        transform: rotate(180deg);
    }

    .dropdown-button:hover {
        color: white;
        border-color: #9bbe00;
    }

    .dropdown-button:focus {
        outline: 2px solid #9bbe00;
        outline-offset: 2px;
    }

    .dropdown-list {
        position: absolute;
        top: calc(100% + 0.5rem);
        background-color: #2f2f2f;
        border: grey 2px solid;
        border-radius: 1rem;
        list-style: none;
        padding: 0;
        margin: 0;
        min-width: 10rem;
        z-index: 1000;
    }

    .dropdown-item {
        padding: 0.75rem 1.5rem;
        cursor: pointer;
        white-space: nowrap;
        border-radius: 1rem;
    }

    .dropdown-item.selected,
    .dropdown-item:hover {
        color: white;
        background-color: #444;
    }
</style>
