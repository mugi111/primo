<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { CodeMirror } from "../../../components";

  export let disabled = false;

  export let variants = "";

  export let html = "";
  export let css = "";
  export let js = "";

  let activeTab = "html";
</script>

<style>
  .tabs {
    height: 35px;

    ul {
      @apply flex justify-around;

      li {
        @apply flex-1 border-transparent text-xs font-bold;
        border-top: 1px solid #eee;

        button {
          @apply w-full text-center py-2 outline-none text-xs font-bold;

          /* i {
            @apply mr-2;
          } */
        }

        &.is-active {
          @apply bg-codeblack text-white border-codeblack !important;
        }

        &:first-child {
          border-top-left-radius: 5px;
          border-left: 1px solid #eee;
          border-right: 1px solid #eee;
        }
        &:last-child {
          border-top-right-radius: 5px;
          border-left: 1px solid #eee;
          border-right: 1px solid #eee;
        }
      }
    }
  }
</style>

<div class="flex flex-col {variants}">
  <div class="tabs is-toggle is-fullwidth is-small">
    <ul>
      <li class:is-active={activeTab === 'html'}>
        <button on:click={() => (activeTab = 'html')}>
          <span>HTML</span>
        </button>
      </li>
      <li class:is-active={activeTab === 'css'}>
        <button on:click={() => (activeTab = 'css')}> <span>CSS</span> </button>
      </li>
      <li class:is-active={activeTab === 'js'}>
        <button on:click={() => (activeTab = 'js')}> <span>JS</span> </button>
      </li>
    </ul>
  </div>
  {#if activeTab === 'html'}
    <CodeMirror
      autofocus
      bind:value={html}
      mode={{ name: 'handlebars', base: 'text/html' }}
      {disabled}
      on:change={({ detail }) => dispatch('htmlChange')}
      on:save={() => dispatch('save')}
      docs="https://handlebarsjs.com/guide/" />
  {:else if activeTab === 'css'}
    <CodeMirror
      autofocus
      bind:value={css}
      mode={'css'}
      {disabled}
      on:change={({ detail }) => dispatch('cssChange')}
      on:save={() => dispatch('save')} />
  {:else}
    <CodeMirror
      autofocus
      bind:value={js}
      mode={'javascript'}
      {disabled}
      on:change={({ detail }) => dispatch('jsChange')}
      on:save={() => dispatch('save')} />
  {/if}
</div>
