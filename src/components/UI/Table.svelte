<script>
  import { createEventDispatcher } from "svelte";
  export let tableData = [];
  let dispatch = createEventDispatcher();
</script>

<table>
  <thead>
    <tr>
      {#each Object.keys(tableData[0]) as columnHeading}
        <th>{columnHeading}</th>
      {/each}
    </tr><tr />
  </thead>
  <tbody>
    {#each Object.values(tableData) as row}
      <tr>
        {#each Object.values(row) as cell}
          <td>{cell}</td>
        {/each}
        <span
          class="material-icons cursor"
          on:click={() => dispatch("deleteIngredient", row)}>delete</span
        >
      </tr>
    {/each}
  </tbody>
</table>
