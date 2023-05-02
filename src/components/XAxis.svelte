<script>
	export let id;
  let w;
  let h;
</script>

<p>size: {w}px x {h}px</p>

<div bind:clientWidth={w} bind:clientHeight={h}>
	<h3>X-axis Component for Component {id}</h3>
	<!-- Your X-axis component content goes here -->
</div>


<style>
  div {
    background-color: #FFF;
  }
</style>