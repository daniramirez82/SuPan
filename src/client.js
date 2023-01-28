import * as sapper from '@sapper/app';
import { detach_before_dev } from 'svelte/internal';
import '../node_modules/materialize-css/dist/css/materialize.css';
import '../node_modules/materialize-css/dist/js/materialize';
import {firebaseConfig} from './firebaseConfig';

let app = firebase.initializeApp(firebaseConfig);
window.db = app.firestore();
sapper.start({
	target: document.querySelector('#sapper')
});

M.AutoInit();