<script>
	export let id;
	let w;
	let h;
</script>

<div bind:clientWidth={w} bind:clientHeight={h}>
	<p>size: {w}px x {h}px</p>
	<h3>X-axis Component for Component {id}</h3>
	<!-- Your X-axis component content goes here -->
</div>

<style>
	div {
    width: 100%;
    height: 100%;
		background-color: #fff;
	}
</style>
