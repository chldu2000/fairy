<script lang="ts">
    import type { Persona } from '$lib/types';
    import type { SvelteMap } from 'svelte/reactivity';
    import { savePersona, deletePersona } from '$lib/store.svelte';
    import FButton from '$lib/widgets/FButton.svelte';

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
        icon: '',
    }) as Persona;

    // 验证错误
    let errors: Partial<Record<keyof Persona, string>> = $state({}) as Partial<
        Record<keyof Persona, string>
    >;

    // 打开新增表单
    function openAddForm() {
        isEditing = false;
        editingName = '';
        formData = {
            name: '',
            description: '',
            systemPrompt: '',
            icon: '',
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
        } else if (
            (!isEditing || formData.name !== editingName) &&
            personas.has(formData.name)
        ) {
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
        <FButton onclick={openAddForm}>新增 Persona</FButton>
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
                <h2>{isEditing ? '编辑 Persona' : '新增 Persona'}</h2>
            </div>
            <form
                class="persona-form"
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
                <p>确定要删除 Persona "{personaToDelete}" 吗？</p>
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
    .personas-container {
        padding: 1rem;
    }

    .action-bar {
        margin-bottom: 1rem;
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
        background-color: white;
        border: grey 3px solid;
        border-radius: 1.25rem;
        transition: all 0.2s ease;
    }

    .persona-item:hover {
        border-color: #9bbe00;
        box-shadow: 0 0 0 3px rgba(155, 190, 0, 0.2);
    }

    .persona-info {
        flex: 1;
    }

    .persona-name {
        color: black;
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
        color: grey;
    }

    .persona-actions {
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
        background-color: white;
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
        color: black;
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
        color: black;
    }

    .form-field input,
    /* .form-field select, */
    .form-field textarea {
        padding: 0.5rem 1rem;
        border: grey 2px solid;
        border-radius: 1rem;
        font-size: 1rem;
        font-family: inherit;
        background-color: white;
        transition: all 0.2s ease;
    }

    .form-field textarea {
        resize: vertical;
        min-height: 100px;
    }

    .form-field input:focus,
    /* .form-field select:focus, */
    .form-field textarea:focus {
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
        color: black;
        margin: 0.5rem 0;
    }

    .confirm-body p.warning {
        color: #faad14;
        font-weight: bold;
    }
</style>
