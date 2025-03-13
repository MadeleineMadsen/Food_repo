import { BASE_URL } from './info.js';

const DEFAULT_RECIPES = 10;

//Første metoder (Indeholder html) - Denne metode henter opskrifter en ad gangen ved at foretage et API-kald inden for en for-løkke.
// Når dataene er hentet, tilføjes de direkte til HTML via innerHTML +=, hvilket fører til gentagne DOM-manipulationer.

// Hvorfor bør man (ikke) bruge den? 
    // GENERELT BARE DÅRLIG PRAKSIS
    // - Bruger innerHTML +=, hvilket betyder, at hele HTML-indholdet genskrives ved hver iteration – ineffektivt og kan føre til unødige omtegninger af DOM.
    // - Kan føre til sikkerhedsproblemer, hvis data ikke er sanitiseret (f.eks. risiko for XSS-angreb).
    // - Manglende asynkron håndtering: fetch-kald sker asynkront, hvilket betyder, at elementerne ikke nødvendigvis tilføjes i rækkefølge.

// eslint-disable-next-line no-unused-vars
const showRandomRecipesWithInnerHTML = (numRecipes = DEFAULT_RECIPES) => {

    for (let index = 0; index < numRecipes; index++) {

        fetch(`${BASE_URL}/random.php`)
        .then(response => response.json())
        .then(data => {
            data = data.meals[0];
            document.querySelector('#recipe-list').innerHTML += `
                <article>
                    <header>
                        <h2>${data.strMeal}</h2>
                    </header>
                    <img src="${data.strMealThumb}/preview" alt="${data.strMeal}">
                    <div>
                        <p class="pill">${data.strCategory}</p>
                        <p class="pill">${data.strArea}</p>
                    </div>
                </article>
            `;
        })
        .catch(error => console.log(error));
    }

};

// Anden metode (Indeholder html) - Ligner den første metode, men gemmer den opbyggede HTML i en variabel (recipeList) og indsætter det hele på én gang til sidst.
// Bruger await for at sikre, at alle API-kald er fuldført, før innerHTML opdateres.

//Hvorfor bør man (ikke) bruge den?
    // GENERELT BARE DÅRLIG PRAKSIS
    // - Bruger stadig innerHTML, som er en sikkerhedsrisiko og kan føre til performanceproblemer.
    // - Mere effektiv end metode 1, fordi den kun opdaterer DOM én gang, men stadig ikke optimal.
    // - API-kaldene udføres sekventielt, ikke parallelt, hvilket gør metoden langsommere.

// eslint-disable-next-line no-unused-vars
const showRandomRecipesWithInnerHTMLAndOnePageRefresh = async (numRecipes = DEFAULT_RECIPES) => {

    let recipeList = '';
    for (let index = 0; index < numRecipes; index++) {

        await fetch(`${BASE_URL}/random.php`)
        .then(response => response.json())
        .then(data => {
            data = data.meals[0];
            recipeList += `
                <article>
                    <header>
                        <h2>${data.strMeal}</h2>
                    </header>
                    <img src="${data.strMealThumb}/preview" alt="${data.strMeal}">
                    <div>
                        <p class="pill">${data.strCategory}</p>
                        <p class="pill">${data.strArea}</p>
                    </div>
                </article>
            `;
        })
        .catch(error => console.log(error));

        document.querySelector('#recipe-list').innerHTML = recipeList;
    }
};

// Tredje metode (Indeholder ikke html) - Bruger document.createElement til at opbygge HTML-strukturen dynamisk i stedet for innerHTML.
// Samler alle elementer i et DocumentFragment, før det tilføjes til DOM.

//Hvorfor bør man bruge den?
    //BEST PRACTICE
    // - Sikker løsning – undgår innerHTML og dermed XSS-risici.
    // - Mindre DOM-manipulation – DocumentFragment sikrer, at opdateringen sker én gang i stedet for gentagne gange i for-løkken.
    // - Mere fleksibel – let at udvide og vedligeholde.

// Anbefales, da det er god metode, men HTML templates er endnu bedre (4 metode).

// eslint-disable-next-line no-unused-vars
const showRandomRecipesWithCreateElement = async (numRecipes = DEFAULT_RECIPES) => {

    const fragment = document.createDocumentFragment();
    for (let index = 0; index < numRecipes; index++) {

        await fetch(`${BASE_URL}/random.php`)
        .then(response => response.json())
        .then(data => {
            data = data.meals[0];

            const h2 = document.createElement('h2');
            h2.innerText = data.strMeal;

            const header = document.createElement('header');
            header.append(h2);

            const img = document.createElement('img');
            img.setAttribute('src', `${data.strMealThumb}/preview`);
            img.setAttribute('alt', data.strMeal);

            const pCategory = document.createElement('p');
            pCategory.classList.add('pill');
            pCategory.innerText = data.strCategory;

            const pArea = document.createElement('p');
            pArea.classList.add('pill');
            pArea.innerText = data.strArea;
            
            const div = document.createElement('div');
            div.append(pCategory);
            div.append(pArea);

            const article = document.createElement('article');
            article.append(header);
            article.append(img);
            article.append(div);

            fragment.append(article);
        })

        .catch(error => console.log(error));
    }

    document.querySelector('#recipe-list').append(fragment);
};

// Fjerde metode (Indeholder ikke html) - Bruger en HTML <template>-tag fra HTML-dokumentet (index.html) til at skabe opskriftskort.
// Henter og kloner templaten med content.cloneNode(true), før den udfyldes med data.
// Tilføjer derefter kortene til et DocumentFragment, som indsættes i DOM.

//Hvorfor bør man bruge den?
    //BEST PRACTICE
    // - Adskiller HTML fra JavaScript, hvilket gør koden lettere at vedligeholde.
    // - Mere effektiv DOM-manipulation – template gør det let at oprette flere instanser uden at skrive HTML i JavaScript.
    // - Forbedret ydeevne – bruger DocumentFragment for at undgå unødige DOM-opdateringer.

// Denne metode er den bedste og bør foretrækkes for vedligeholdbarhed, sikkerhed og performance.

const showRandomRecipes = async (numRecipes = DEFAULT_RECIPES) => {

    const fragment = document.createDocumentFragment();
    for (let index = 0; index < numRecipes; index++) {

        await fetch(`${BASE_URL}/random.php`)
        .then(response => response.json())
        .then(data => {
            data = data.meals[0];

            const card = document.querySelector('#recipe-card').content.cloneNode(true);

            card.querySelector('h2').innerText = data.strMeal;

            const img = card.querySelector('img');
            img.setAttribute('src', `${data.strMealThumb}/preview`);
            img.setAttribute('alt', data.strMeal);

            card.querySelector('.pill:first-of-type').innerText = data.strCategory;
            card.querySelector('.pill:last-of-type').innerText = data.strArea;

            card.querySelectorAll('a').forEach(link => {
                link.href = `recipe.html?id=${data.idMeal}`;
            });

            fragment.append(card);
        })

        .catch(error => console.log(error));
    }

    document.querySelector('#recipe-list').append(fragment);
};

showRandomRecipes();