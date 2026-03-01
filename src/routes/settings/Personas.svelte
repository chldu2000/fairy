<script lang="ts">
    import type { Persona } from '$lib/types';
    import type { SvelteMap } from 'svelte/reactivity';
    import { savePersona, deletePersona } from '$lib/store.svelte';

    type Props = {
        personas: SvelteMap<string, Persona>;
    };

    let { personas }: Props = $props();

    // 状态管理
    let isFormVisible = $state(false);
    let isEditing = $state(false);
    let editingName = ''; // 用于编辑时存储原始名称
    let showDeleteConfirm = $state(false);
    let personaToDelete = $state('');

    // 表单数据
    let formData: Persona = $state({
        name: '',
        description: '',
        systemPrompt: '',
        icon: ''
    }) as Persona;

    // 验证错误
    let errors: Partial<Record<keyof Persona, string>> = $state({}) as Partial<Record<keyof Persona, string>>;

    // 打开新增表单
    function openAddForm() {
        isEditing = false;
        editingName = '';
        formData = {
            name: '',
            description: '',
            systemPrompt: '',
            icon: ''
        };
        errors = {};
        isFormVisible = true;
    }

    // 打开编辑表单
    function openEditForm(name: string) {
        const persona = personas.get(name);
        if (persona) {
            isEditing = true;
            editingName = name;
            formData = { ...persona };
            errors = {};
            isFormVisible = true;
        }
    }

    // 验证表单
    function validateForm(): boolean {
        const newErrors: Partial<Record<keyof Persona, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = '名称不能为空';
        } else if ((!isEditing || formData.name !== editingName) && personas.has(formData.name)) {
            newErrors.name = 'Persona 名称已存在';
        }

        if (!formData.description.trim()) {
            newErrors.description = '描述不能为空';
        }

        if (!formData.systemPrompt.trim()) {
            newErrors.systemPrompt = '系统提示词不能为空';
        }

        errors = newErrors;
        return Object.keys(newErrors).length === 0;
    }

    // 提交表单
    async function handleSubmit() {
        if (validateForm()) {
            try {
                await savePersona(formData);
                isFormVisible = false;
                // 如果是编辑模式且名称改变，需要删除旧记录
                if (isEditing && formData.name !== editingName) {
                    await deletePersona(editingName);
                }
            } catch (error) {
                console.error('Error saving persona:', error);
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
        personaToDelete = name;
        showDeleteConfirm = true;
    }

    // 取消删除
    function cancelDelete() {
        showDeleteConfirm = false;
        personaToDelete = '';
    }

    // 确认删除
    async function confirmDelete() {
        try {
            await deletePersona(personaToDelete);
            showDeleteConfirm = false;
            personaToDelete = '';
        } catch (error) {
            console.error('Error deleting persona:', error);
            alert('删除失败，请重试');
        }
    }
</script>

<div class="personas-container">
    <!-- 操作栏 -->
    <div class="action-bar">
        <button class="add-button" onclick={openAddForm}>
            新增 Persona
        </button>
    </div>

    <!-- Persona 列表 -->
    <div class="persona-list">
        {#each personas.entries() as [name, persona] (name)}
            <div class="persona-item">
                <div class="persona-info">
                    <div class="persona-name">
                        {#if persona.icon}
                            <span class="persona-icon">{persona.icon}</span>
                        {/if}
                        {name}
                    </div>
                    <div class="persona-details">
                        <span>描述: {persona.description}</span>
                    </div>
                </div>
                <div class="persona-actions">
                    <button class="edit-button" onclick={() => openEditForm(name)}>
                        编辑
                    </button>
                    <button class="delete-button" onclick={() => openDeleteConfirm(name)}>
                        删除
                    </button>
                </div>
            </div>
        {/each}
    </div>

    <!-- 表单区域 -->
    {#if isFormVisible}
        <div class="form-overlay" onclick={handleCancel} aria-hidden="true" ></div>
        <div class="form-container">
            <div class="form-header">
                <h2>{isEditing ? '编辑 Persona' : '新增 Persona'}</h2>
            </div>
            <form class="persona-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div class="form-field">
                    <label for="name">名称 *</label>
                    <input
                        id="name"
                        type="text"
                        bind:value={formData.name}
                        placeholder="输入 Persona 名称"
                    />
                    {#if errors.name}
                        <span class="error">{errors.name}</span>
                    {/if}
                </div>

                <div class="form-field">
                    <label for="icon">图标</label>
                    <input
                        id="icon"
                        type="text"
                        bind:value={formData.icon}
                        placeholder="可选，例如: 🤖"
                    />
                </div>

                <div class="form-field">
                    <label for="description">描述 *</label>
                    <input
                        id="description"
                        type="text"
                        bind:value={formData.description}
                        placeholder="输入 Persona 描述"
                    />
                    {#if errors.description}
                        <span class="error">{errors.description}</span>
                    {/if}
                </div>

                <div class="form-field">
                    <label for="systemPrompt">系统提示词 *</label>
                    <textarea
                        id="systemPrompt"
                        bind:value={formData.systemPrompt}
                        placeholder="输入系统提示词"
                        rows={6}
                    ></textarea>
                    {#if errors.systemPrompt}
                        <span class="error">{errors.systemPrompt}</span>
                    {/if}
                </div>

                <div class="form-actions">
                    <button type="submit" class="submit-button">
                        保存
                    </button>
                    <button type="button" class="cancel-button" onclick={handleCancel}>
                        取消
                    </button>
                </div>
            </form>
        </div>
    {/if}

    <!-- 删除确认对话框 -->
    {#if showDeleteConfirm}
        <div class="form-overlay" onclick={cancelDelete} aria-hidden="true" ></div>
        <div class="confirm-dialog">
            <div class="confirm-header">
                <h3>确认删除</h3>
            </div>
            <div class="confirm-body">
                <p>确定要删除 Persona "{personaToDelete}" 吗？</p>
                <p class="warning">此操作无法撤销。</p>
            </div>
            <div class="confirm-actions">
                <button class="confirm-button" onclick={confirmDelete}>
                    删除
                </button>
                <button class="cancel-button" onclick={cancelDelete}>
                    取消
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .personas-container {
        padding: 1rem;
    }

    .action-bar {
        margin-bottom: 1rem;
    }

    .add-button {
        padding: 0.5rem 1rem;
        background-color: #0070f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .add-button:hover {
        background-color: #0051cc;
    }

    .persona-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .persona-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .persona-info {
        flex: 1;
    }

    .persona-name {
        color: #333;
        font-weight: bold;
        margin-bottom: 0.25rem;
        font-size: 1.1rem;
    }

    .persona-icon {
        margin-right: 0.5rem;
        font-size: 1.2rem;
    }

    .persona-details {
        font-size: 0.9rem;
        color: #666;
    }

    .persona-actions {
        display: flex;
        gap: 0.5rem;
    }

    .edit-button, .delete-button {
        padding: 0.25rem 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        background-color: white;
    }

    .edit-button:hover {
        background-color: #f0f0f0;
    }

    .delete-button:hover {
        background-color: #ff4d4f;
        color: white;
        border-color: #ff4d4f;
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

    .form-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 1.5rem;
        width: 90%;
        max-width: 500px;
        z-index: 101;
    }

    .form-header h2 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #333;
    }

    .persona-form {
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
        color: #555;
    }

    .form-field input,
    .form-field textarea {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }

    .form-field textarea {
        resize: vertical;
        min-height: 100px;
    }

    .form-field input:focus,
    .form-field textarea:focus {
        outline: none;
        border-color: #0070f3;
        box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
    }

    .error {
        color: #ff4d4f;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .submit-button, .cancel-button {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .submit-button {
        background-color: #0070f3;
        color: white;
        border: none;
    }

    .submit-button:hover {
        background-color: #0051cc;
    }

    .cancel-button {
        background-color: #f0f0f0;
        color: #333;
        border: 1px solid #ddd;
    }

    .cancel-button:hover {
        background-color: #e0e0e0;
    }

    .confirm-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 1.5rem;
        width: 90%;
        max-width: 400px;
        z-index: 101;
    }

    .confirm-header h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #333;
    }

    .confirm-body {
        margin-bottom: 1.5rem;
    }

    .confirm-body p {
        color: #555;
        margin: 0.5rem 0;
    }

    .confirm-body p.warning {
        color: #faad14;
        font-weight: bold;
    }

    .confirm-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }

    .confirm-button {
        padding: 0.5rem 1rem;
        background-color: #ff4d4f;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .confirm-button:hover {
        background-color: #d9363e;
    }
</style>