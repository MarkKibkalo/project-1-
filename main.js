const dateStart = document.getElementById('date-start');
const dateEnd = document.getElementById('date-end');
const presetsWeek = document.querySelector('.presets-btn__week');
const presetsMouth = document.querySelector('.presets-btn__month');
const buttonCalculate = document.querySelector('.btn');
const typeDays = document.querySelector('.result__days__type');
const dimensionType = document.querySelector('.result__dimention');
const resultCalculation = document.querySelector('.result__time__difference')
const resultStart = document.querySelector('.result__start__data');
const resultEnd = document.querySelector('.result__end__data')

const MAP_DURATION_TO_TIME = {
   Seconds: 1000, 
   Minutes: 1000 * 60,
   Hours: 1000 * 60 * 60,
   Days: 1000 * 60 * 60 * 24,
}

const MAP_DURATION_TO_TYPE_DAYS = {
   Seconds: 1000 * 60,
   Minutes: 1000 * 60 * 60,
   Hours: 1000 * 60 * 60 * 24,
}

presetsMouth.addEventListener('click', addMonth);
presetsWeek.addEventListener('click', addWeek);
dateStart.addEventListener('input', removeDisabled);
buttonCalculate.addEventListener('click', calculateBtn, false); 

function addZero(date) {
   return (date < 10) ? '0'+date : date;
}

function addMonth(e){
   e.preventDefault();
   const addStartDate = new Date(dateStart.valueAsDate);
   const getYear = addStartDate.getFullYear();
   const getMonth = addZero(addStartDate.getMonth()+2);
   const getDay = addZero(addStartDate.getDate());
   const resultAdd = (`${getYear}-${getMonth}-${getDay}`);
   dateEnd.value = resultAdd;
}

function addWeek(e){
   e.preventDefault();
   let addStartDate = new Date(dateStart.value);
   const getYear = addStartDate.getFullYear();
   const getMonth = addZero(addStartDate.getMonth()+1);
   const getDay = addZero(addStartDate.getDate()+7);
   const resultAdd = (`${getYear}-${getMonth}-${getDay}`);
   dateEnd.value = resultAdd;
}

function removeDisabled() {
   if(!dateStart.value == ''){
      dateEnd.removeAttribute('disabled');
      presetsWeek.removeAttribute('disabled');
      presetsMouth.removeAttribute('disabled');
      buttonCalculate.removeAttribute('disabled');
   }
}

function calculateDays() {

}

function calculateBtn(e) {
   e.preventDefault();
   if (dateStart.value > dateEnd.value) {
      alert('Перевірте вказані дати')
      return
   }

   const days = document.querySelectorAll('.days__choose');
   for (let i = 0; i < days.length; i++){
      if (days[i].checked) {
         resultDays = days[i].value;
         type = days[i].id;
      }
   }
   
   const dimension = document.querySelectorAll('.dimention__time')
   for (let i = 0; i < dimension.length; i++){
      if (dimension[i].checked) {
         data = dimension[i].value;
      }
   }

   const dayType = type;
   let current = new Date(dateStart.value);
   let counter = 0;

   if (resultDays === 'Будні дні') {
      const weekendDay = [5, 6];
            
      while (current < new Date(dateEnd.value)) {
         const currentDay = current.getUTCDate();
         const dayNumber = current.getDay();
   
         if (weekendDay.includes(dayNumber)) {
            counter++;
         };
   
         current.setUTCDate(currentDay + 1);
      }
   }
   if (resultDays === 'Вихідні дні') {
      const weekDay = [0, 1, 2, 3, 4];
            
      while (current < new Date(dateEnd.value)) {
         const currentDay = current.getUTCDate();
         const dayNumber = current.getDay();
   
         if (weekDay.includes(dayNumber)) {
            counter++;
         }

         current.setUTCDate(currentDay + 1);
      }
   }   

   const resultItem = document.querySelector('.result');
   const absDifference = (new Date(dateEnd.value) - new Date(dateStart.value));
   const resultDifference = (absDifference - (counter*24*60*60*1000)) / MAP_DURATION_TO_TIME[data];
   const resultList = document.querySelectorAll('.result');

   if (resultList.length <= 10) {
      resultItem.insertAdjacentHTML(
         'beforeend', 
         `
            <ul class="result">
               <li class="result__item">
               <div class="result__start result-data">Старт
                  <div class="result__start__data">${dateStart.value}</div>
               </div>
               <div class="result__end result-data">Кінець
                  <div class="result__end__data">${dateEnd.value}</div>
               </div>
               <div class="result__days result-data">Тип
                  <div class="result__days__type">${resultDays}</div>
               </div>
               <div class="result__time result-data">Різниця
                  <div class="result__time__difference">${resultDifference}</div>
               </div>
               <div class="result__unit-time result-data">Одиниці виміру
                  <div class="result__dimention">${data}</div>
               </div>
               </li>
            </ul>
         `
      )         
         
      const itemToSave = {
         start: dateStart.value,
         end: dateEnd.value,
         days: resultDays,
         difference: resultDifference,
         dimension: data,
      }
      setValueToLS(itemToSave, 'dates');

   }
   if (resultList.length >= 10) {
      const arreyResultList = Array.from(resultList);
      arreyResultList.pop();
      
      resultItem.insertAdjacentHTML(
         'afterbegin', 
         `
            <ul class="result">
               <li class="result__item">
               <div class="result__start result-data">Старт
                  <div class="result__start__data">${dateStart.value}</div>
               </div>
               <div class="result__end result-data">Кінець
                  <div class="result__end__data">${dateEnd.value}</div>
               </div>
               <div class="result__days result-data">Тип
                  <div class="result__days__type">${resultDays}</div>
               </div>
               <div class="result__time result-data">Різниця
                  <div class="result__time__difference">${resultDifference}</div>
               </div>
               <div class="result__unit-time result-data">Одиниці виміру
                  <div class="result__dimention">${data}</div>
               </div>
               </li>
            </ul>
         `
      )

      const itemToSave = {
         start: dateStart.value,
         end: dateEnd.value,
         days: resultDays,
         difference: resultDifference,
         dimension: data,
      }
      setValueToLS(itemToSave, 'dates');         
   }
}




function setValueToLS(value, key) {
   const lsDates = getValueToLS(key);

   localStorage.setItem(key, JSON.stringify([...lsDates, value]));
}

function getValueToLS(key) {
   const item = localStorage.getItem(key);

   if (!item) {
      return [];
   }

   return JSON.parse(item);
}

document.addEventListener('DOMContentLoaded', () => {
   const items = getValueToLS('dates');

   console.log(items);

   const resultItem = document.querySelector('.result');

   for(i=0; i<10; i++) {
      resultItem.insertAdjacentHTML(
         'afterbegin', 
         `
         <ul class="result">
            <li class="result__item">
               <div class="result__start result-data">Старт
                  <div class="result__start__data">${items[i].start}</div>
               </div>
               <div class="result__end result-data">Кінець
                  <div class="result__end__data">${items[i].end}</div>
               </div>
               <div class="result__days result-data">Тип
                  <div class="result__days__type">${items[i].days}</div>
               </div>
               <div class="result__time result-data">Різниця
                  <div class="result__time__difference">${items[i].difference}</div>
               </div>
               <div class="result__unit-time result-data">Одиниці виміру
                  <div class="result__dimention">${items[i].dimension}</div>
               </div>
            </li>
         </ul>
         `
      )
   }

})