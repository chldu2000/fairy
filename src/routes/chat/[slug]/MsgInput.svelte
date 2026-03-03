<script lang="ts">
    import KKButton from "$lib/widgets/KKButton.svelte";
    import { sendMessage } from "$lib/worker.svelte";

    function handleSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const textarea = form.querySelector('textarea') as HTMLTextAreaElement;
        const message = textarea.value.trim();
        textarea.value = "";
        // 重置 textarea 高度
        textarea.style.height = "auto";
        if (!message) return;

        try {
            sendMessage(message);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    // 自动调整 textarea 高度
    function autoResizeTextarea(event: Event) {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }

    // 处理键盘事件
    function handleKeyDown(event: KeyboardEvent) {
        // 按下回车键、没有按下 shift 时触发提交
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            const target = event.target as HTMLTextAreaElement;
            const message = target.value.trim();
            target.value = "";
            target.style.height = "auto";
            if (!message) return;

            try {
                sendMessage(message);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
        // shift + Enter 会触发默认的换行行为
    }
</script>

<div id="input-layout">
    <form onsubmit={handleSubmit}>
        <textarea
            id="message-input"
            placeholder="Type your message here..."
            rows="1"
            oninput={autoResizeTextarea}
            onkeydown={handleKeyDown}
        ></textarea>
        <KKButton id="submit-button" type="submit">Submit</KKButton>
    </form>
</div>

<style>
    #input-layout {
        display: flex;
        flex: 1;
        flex-direction: row;
        align-items: flex-end;
        padding-top: 8px;
    }

    form {
        display: flex;
        flex: 1;
        flex-direction: row;
        align-items: flex-end;
    }

    #message-input {
        flex: 1;
        background-color: black;
        color: white;
        border-radius: 1rem;
        resize: none;
        overflow-y: hidden;
        min-height: 2.5rem;
        max-height: 200px; /* 设置最大高度 */
        padding: 0.6rem;
        margin-bottom: 0.5rem;
        box-sizing: border-box;
    }

    #message-input:focus {
        outline: 2px solid #9bbe00;
        outline-offset: 2px;
    }
</style>