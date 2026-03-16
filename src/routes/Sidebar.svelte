<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { scale } from 'svelte/transition';
    import FButton from '$lib/widgets/FButton.svelte';
    import {
        chatHistory,
        selectedChat,
        createChatSession,
        deleteChatSession,
        saveChatSession,
    } from '$lib/store.svelte';

    const chatEntries = $derived(
        Array.from(chatHistory.entries())
            .map(([id, session]) => ({
                id,
                name: session.name,
            }))
            .reverse(),
    );

    // 重命名相关状态
    let isRenameFormVisible = $state(false);
    let renameChatId = $state(-1);
    let renameNewName = $state('');
    let renameError = $state('');

    async function jumpTo(target: number) {
        if (target === -1) {
            // window.location.href = resolve('/settings');
            // selectChat(-1);
            goto(resolve('/settings'));
        } else if (target >= 0) {
            // selectedChatId.set(target);
            const newChatId = await createChatSession('Unnamed Chat');
            console.log(`Created chat: ${newChatId}`);
            goto(resolve(`/chat/${newChatId}`));
        } else {
            console.error('Invalid target for onclick:', target);
        }
    }

    function handleDeleteChat(event: Event, id: number) {
        event.preventDefault();
        event.stopPropagation();

        const isCurrentChat = selectedChat.id === id;

        console.log(`Deleting chat: ${id}`);
        deleteChatSession(id);
        if (isCurrentChat) {
            goto(resolve('/'));
        }
    }

    function handleRenameChat(event: Event, id: number, currentName: string) {
        event.preventDefault();
        event.stopPropagation();

        renameChatId = id;
        renameNewName = currentName;
        renameError = '';
        isRenameFormVisible = true;
    }

    async function handleRenameSubmit() {
        if (!renameNewName.trim()) {
            renameError = '名称不能为空';
            return;
        }

        try {
            const chatSession = chatHistory.get(renameChatId);
            if (chatSession) {
                chatSession.name = renameNewName.trim();
                await saveChatSession(chatSession);
                isRenameFormVisible = false;
                renameChatId = -1;
                renameNewName = '';
                renameError = '';
            }
        } catch (error) {
            console.error('Error renaming chat session:', error);
            renameError = '重命名失败，请重试';
        }
    }

    function handleRenameCancel() {
        isRenameFormVisible = false;
        renameChatId = -1;
        renameNewName = '';
        renameError = '';
    }

    // 新增：输入框引用
    let renameInput = $state<HTMLInputElement | null>(null);

    // 新增：当模态框显示时自动聚焦
    $effect(() => {
        if (isRenameFormVisible && renameInput) {
            renameInput.focus();
        }
    });
</script>

<div class="sidebar">
    <FButton onclick={() => jumpTo(0)}>New Chat</FButton>
    <div class="chat-list">
        {#each chatEntries as chat (chat.id)}
            <a
                href={resolve(`/chat/${chat.id}`)}
                class="chat-item {selectedChat.id === chat.id
                    ? 'selected'
                    : ''}"
                transition:scale
            >
                <span class="chat-name">{chat.name}</span>
                <div class="chat-actions">
                    <FButton
                        preset="plain"
                        class="auto-hide"
                        onclick={(e) => handleRenameChat(e, chat.id, chat.name)}>✎</FButton
                    >
                    <FButton
                        preset="plain"
                        class="auto-hide"
                        onclick={(e) => handleDeleteChat(e, chat.id)}>✕</FButton
                    >
                </div>
            </a>
        {/each}
    </div>
    <FButton onclick={() => jumpTo(-1)}>Settings</FButton>
</div>

<!-- 重命名模态框 -->
{#if isRenameFormVisible}
    <div
        class="form-overlay"
        onclick={handleRenameCancel}
        aria-hidden="true"
    ></div>
    <div class="form-container">
        <div class="form-header">
            <h2>重命名聊天</h2>
        </div>
        <form
            class="rename-form"
            onsubmit={(e) => {
                e.preventDefault();
                handleRenameSubmit();
            }}
        >
            <div class="form-field">
                <label for="newName">聊天名称 *</label>
                <input
                    id="newName"
                    type="text"
                    bind:value={renameNewName}
                    bind:this={renameInput}
                    placeholder="输入聊天名称"
                />
                {#if renameError}
                    <span class="error">{renameError}</span>
                {/if}
            </div>
            <div class="form-actions">
                <button type="submit" class="submit-button"> 保存 </button>
                <button
                    type="button"
                    class="cancel-button"
                    onclick={handleRenameCancel}
                >
                    取消
                </button>
            </div>
        </form>
    </div>
{/if}

<style>
    @import '$lib/style/animation.css';

    .sidebar {
        width: 20rem;
        /* height: 100vh; */
        display: flex;
        flex-direction: column;
        /* border-right: 3px solid gray; */
        /* margin: 4px; */
        /* padding: 4px; */
        /* border-radius: 1rem; */
    }

    .chat-list {
        flex: 1; /* take up all available space */
        display: flex;
        flex-direction: column;
        overflow-y: auto; /* enable vertical scrolling if content overflows */
    }

    .chat-item {
        background-color: #2f2f2f;
        color: white;

        /* width: 15rem; */
        min-height: 2rem;
        border-radius: 1rem;
        padding: 0 1rem;
        margin: 0.5rem;
        flex-shrink: 0;

        text-decoration: none;
        text-align: left;
        line-height: 2rem; /* line height = element height -> vertically center text */
        /* white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; */

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chat-item:focus {
        outline: 2px solid #9bbe00;
        outline-offset: 2px;
    }

    .chat-item :global(.auto-hide) {
        display: none; /* hide icon buttons if parent is not selected */
    }

    .chat-item.selected,
    .chat-item:hover {
        /* background-color: yellow; */
        color: black;
        /* border: yellow 0.25rem solid; */
        animation: breath 2s infinite alternate;
    }

    .chat-item.selected :global(.auto-hide),
    .chat-item:hover :global(.auto-hide) {
        display: flex; /* show icon buttons if parent is selected */
    }

    .chat-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .chat-actions {
        display: flex;
        gap: 0.25rem;
    }

    /* 模态框样式 */
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
        background-color: #1a1a1a;
        border: grey 3px solid;
        border-radius: 1.25rem;
        padding: 1.5rem;
        width: 90%;
        max-width: 400px;
        z-index: 101;
    }

    .form-header h2 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: white;
    }

    .rename-form {
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

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .submit-button,
    .cancel-button {
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        cursor: pointer;
        font-weight: bold;
        font-family: inherit;
        font-size: 1rem;
    }

    .submit-button {
        background-color: #9bbe00;
        color: black;
        border: none;
    }

    .submit-button:hover {
        background-color: #7a9400;
    }

    .cancel-button {
        background-color: #444;
        color: white;
        border: grey 2px solid;
    }

    .cancel-button:hover {
        background-color: #555;
    }
</style>
