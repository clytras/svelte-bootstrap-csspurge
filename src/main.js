import App from './App.svelte';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/scss/bootstrap.scss';
import './App.scss';


const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

window.app = app;

export default app;
