<script>
  import state from "../../Stores/state.js";
  import { fade } from "svelte/transition";

  export let href = "/";
</script>

<header>
  <nav class="amber">
    <div class="nav-wrapper">
      <div class="title">
        {#if $state != "main"}
          <a {href} in:fade out:fade class="back-arrow">
            <span class="material-icons">arrow_back</span>
          </a>
        {/if}
        <span> <a href="/">SuPan</a> </span>
      </div>
    </div>
  </nav>
</header>

<style>
  .back-arrow {
    position: absolute;
    cursor: pointer;
    left: 0;
    top: 0;
  }

  .title {
    width: 100%;
    text-align: center;
  }
</style>
