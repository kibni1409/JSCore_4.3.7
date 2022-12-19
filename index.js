// Заполнение списка автокомплита
const Autocomplete = ( data ) => {

    let ulList = document.querySelector('.listSearch')
    ulList.classList.remove('hidden')

    for( let i = 0; i < 5; i++ ){
        let countName = `.list_${ i }`
        let liList = document.querySelector( countName )
        liList.innerText = data[ i ].name;
    }

}
// Задержка перед отправкой запроса
const debounce = ( fn, ms) => {
    let timeout;
    return function () {
        const fnCall = () => { fn.apply( this, arguments ) }

        clearTimeout( timeout )

        timeout = setTimeout( fnCall, ms)
    }
}


// Создание элементов и событий при загрузки документа
document.addEventListener("DOMContentLoaded", async function (){

    let resultArray = [];

    for( let i = 0; i < 5; i++ ){

        let ulList = document.querySelector('.listSearch')
        ulList.classList.add('hidden')
        let liList = document.createElement("li");

        liList.classList.add(`list_${ i }`);
        liList.addEventListener('click', ( e ) => {
            let search = document.querySelector('.search');
            search.value = ''
            ulList.classList.add('hidden')


            let ulOutput = document.querySelector('.output')
            let liOutput = document.createElement('li');
            let imgOutput = document.createElement('img')

            liOutput.innerText = `Name: ${ e.target.innerText } \n Owner: ${ resultArray[ i ].owner.login } \n Stars: ${ resultArray[ i ].stargazers_count }`;
            liOutput.classList.add(`outList_${ ulOutput.childElementCount }`)
            imgOutput.classList.add('imgOut');
            imgOutput.src = "red.png"
            liOutput.appendChild( imgOutput )

            imgOutput.addEventListener('click', () => {
                liOutput.remove()
            })
            ulOutput.appendChild( liOutput );
        })
        ulList.appendChild( liList )

    }

    // Запрос на сервер
    async function onChange( e ) {
        if ( e.target.value !== '' ){
            await fetch(`https://api.github.com/search/repositories?q=${ e.target.value }&per_page=5`)
                .then( res => { return res.json() } )
                .then( r => {
                    resultArray = r.items;
                    Autocomplete( resultArray )
                } )
        } else {
            resultArray = [];
            let ulList = document.querySelector('.listSearch');
            ulList.classList.add('hidden')
        }
    }

    // Привязка ожидания запроса с событием изменения строки поиска в 500мс
    let onChangeDebounce = debounce( onChange, 500)

    document.querySelector('.search').addEventListener('keyup', onChangeDebounce )
})