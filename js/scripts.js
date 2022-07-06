import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js';


function init() {
    return {
        apiKey: "AIzaSyDd2cZ1nC5rV3iFtM1UQY47g21Av2rQhFI",
        authDomain: "blog-de-um-dev-iniciante.firebaseapp.com",
        projectId: "blog-de-um-dev-iniciante",
        storageBucket: "blog-de-um-dev-iniciante.appspot.com",
        messagingSenderId: "978788235286",
        appId: "1:978788235286:web:75c84425ccff9adde89d37"
    };
}
export { init };

//Configuração
const firebaseConfig = init();

//Inicia o Firebase
const app = initializeApp(firebaseConfig);

//Inicia o Firestore
const db = getFirestore(app);


/* --------------------FUNÇÃO QUE ATRIBUI O BD A UMA VARIÁVEL---------------------- */
async function recebeBanco() {
    const database_denfer = {};
    const produtos = collection(db, "convidados");
    const pesquisa = query(produtos, where("nome", "!=", ""));
    const querySnapshot = await getDocs(pesquisa);
    querySnapshot.forEach((doc) => {
        database_denfer[doc.id] = {
            nome: doc.data()['nome'],
            ativo: doc.data()['ativo'],
            presente: doc.data()['presente'],
            tipo: doc.data()['tipo'],
            titulo: doc.data()['titulo']
        }
        //database_denfer[doc.id] = doc.data();
    });
    window.database = database_denfer;
}
window.deferRecebeBanco = async function () {
    await recebeBanco();
    console.log('Amigo estou aqui');
}

/* function verificaArrays(objetoChaveArray, tags) {
  let condition = false;
  for (let key = 0; key < tags.length; key++) {
    if (objetoChaveArray.includes(tags[key])) {
      condition = true
    }
  }
  return condition
} */
/* --------------------------CREATE---------------------- */

//Retorna os dados do formulário
function dadosParaServ() {
    let dadosServ = {
        nome: primeiraMaiuscula(document.getElementById('nome').value),
        titulo: document.getElementById('descricao').value,
        tipo: document.getElementById('genero').value,
        data: document.getElementById('data').value,
        telefone: document.getElementById('telefone').value,
        ativo: document.getElementById('ativo').checked,

    }
    return dadosServ;
}

//Sobe os dados no Firebase
async function adicionarDados() {
    const modalMsg = document.getElementById("infoAdicionou");
    const dados = dadosParaServ();
    const verifica = await verificaDados(dados.nome);
    if (verifica == true) {
        alert("Já tem alguém com esse nome");
    }
    else {
        if (dados.nome == '') {
            console.log('dados incompletos');
        }
        else {
            const sobe = await addDoc(collection(db, "convidados"), dados);
            console.log(sobe.id);
            window.database[sobe.id] = dados;
            alert('MUITO OBRIGAIDO te espero na minha casa');
            location.href = './index.html';
        }
    }
}
//ADICIONA EFETIVAMENTE
window.adicionarDadosDenfer = async function () {
    adicionarDados();
}

function primeiraMaiuscula(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function verificaDados(nomeAdicionar) {
    if (window.database == '' || window.database == undefined || window.database == null) {
        await deferRecebeBanco();
        console.log('patu');
    }
    let condition = false;
    let consulta = database
    for (const key1 in consulta) {
        if (consulta[key1].nome == nomeAdicionar) {
            condition = true;
        }
    }
    return condition;
}

/* --------------------------READ---------------------- */
//Consulta tudo no bd e exibe para atualizar
window.buscarDados = async function () {
    const { ValueQ1 } = await consultaBancoCompleto();
    imprimeResultado(ValueQ1);
}

//Faz a consulta na variável global
async function consultaBancoCompleto() {
    if (window.database == undefined) {
        await deferRecebeBanco();
    }
    let database = window.database;
    const ValueQ1 = [];
    for (const key1 in database) {
        ValueQ1.push(database[key1]);
    }
    return { ValueQ1 };
}

//Lança na tela
function imprimeResultado(ValueQ1) {
    let elementin = document.getElementById('resultado');
    elementin.innerHTML = '';
    for (const key in ValueQ1) {
        if (Object.keys(ValueQ1[key]).length !== 0) {
            exibeResultado(ValueQ1[key]);
        }
        if (document.getElementById("btnSubmit2") !== null) {
            var Btn2 = document.getElementById("btnSubmit2");
            Btn2.classList.remove("beforeCheck");
            Btn2.classList.add("afterCheck");
        }
    }
}

//Base de impressão
function exibeResultado(consulta) {
    let html = `
      <tr id="${consulta.nome}">
        <td class="linha-nome">${consulta.nome}</td>
        <td>${consulta.titulo}</td>
        <td>${consulta.tipo}</td>
        <td>${consulta.ativo == false || consulta.ativo == undefined ? "Não vou :(" : "Confirmada"}</td>
      </tr>
      `;
    if (consulta.nome !== undefined) {
        let elementin = document.getElementById(`resultado`);
        elementin.insertAdjacentHTML("beforeend", html);
    }
    else {
        elementin.insertAdjacentHTML("beforeend", "<div>Nenhum resultado obtido</div>");
    }
}
