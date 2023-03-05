//Get All Data
const loadAIHub = async (dataLimit) => {
   const url = `https://openapi.programming-hero.com/api/ai/tools`
   const res = await fetch(url);
   const data = await res.json();
   displayData(data.data.tools, dataLimit);
}

// Display all data 
const displayData = (card, dataLimit) => {
   const cardContainer = document.getElementById('card-container');
   cardContainer.textContent = '';
   // dispaly 6 card only 
   const seeMore = document.getElementById("see-more");
   // See More Btn
   if (dataLimit && card.length > 6) {
      card = card.slice(0, 6);
      seeMore.classList.remove('hidden')
   } else {
      seeMore.classList.add('hidden')
   }

   // Sort ByDate
   if (dataLimit === 5) {
      card.sort((a, b) => {
         return new Date(a.published_in) - new Date(b.published_in);
      });
   }

   // get data and display UI
   card.forEach(card => {
      const cardDiv = document.createElement('div');
      const { id, name, description, image, published_in, features } = card;
      let count = 0;
      let featureHtml = "";
      features.forEach(feature => {
         featureHtml += `<li> ${count += 1}.
         ${feature}</li>`;
      });
      cardDiv.classList.add("card-data");
      cardDiv.innerHTML = `
      <div class="p-4 rounded-lg overflow-hidden shadow-lg bg-gradient-to-r from-violet-500 to-fuchsia-500">
         <img class="w-full" src="${image}" alt="Mountain">
         <div class="px-6 py-4">
         <div class="font-samebold text-normal mb-2">Features
            <ul class="py-3 border-b-2 border-b-gray-400">
               <li>${featureHtml}</li>
            </ul>
         </div>
         <h3 class="text-2xl text-gray-800 my-4 font-medium">${name}</h3>

         <div class="flex justify-between items-center">
            <div><i class="fa-solid fa-calendar mr-2"></i><span>${published_in}</span></div>
               <label onClick="cardDetails('${id}')" class="cursor-pointer" for="my-modal-5"><i
                  class="fa-solid fa-arrow-right text-2xl"></i></label>
            </div>
         </div>
      </div>
   `;
      cardContainer.appendChild(cardDiv);
   })
   // Sort by Date
   const sortByDateBtn = document.getElementById('sort-bydate');
   sortByDateBtn.addEventListener('click', () => {
      loadAIHub(5)
   })
}
// See More Btn 
document.getElementById("see-more").addEventListener('click', () => {
   loadAIHub()
})


// single card data
const cardDetails = (id) => {
   let url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
   fetch(url)
      .then((res) => res.json())
      .then((data) => {
         // console.log(data.data);
         showDetails(data.data)
      })
};

// Modal Data Load and Show UI
const showDetails = (data) => {
   const { accuracy, description, features, integrations, logo, pricing, image_link
   } = data;

   // Pricing Data
   let pricingHtml = "";
   pricing !== null && pricing.forEach(price => {
      pricingHtml += `
      <div class="md:flex flex-col justify-center items-center gap-2 shadow-lg rounded-md bg-slate-50 px-2 py-2 ">
         <div class="text-green-600 text-center">${price.price === 'No cost' || price.price === '0' ? "Free of Cost" : price.price}</div>
         <div class="text-orange-600 text-center text-base">${price.plan}</div>
      </div>`;

   });

   // Features Data
   let featureCount = 0;
   let featureHtml = "";
   const featuresData = Object.values(features);
   // console.log(featuresData);
   featuresData.forEach(featureObj => {
      featureHtml += `
    <li class="text-base">${featureCount += 1}. ${featureObj.feature_name}</li>
   `;

   });

   // Intregrations Data
   let intregrationsData = 0;
   let intregrationsHtml = "";
   integrations !== null ? integrations.forEach(intregration => {
      intregrationsHtml += `
      <li class="text-base">${intregrationsData += 1}.${intregration}</li>
   `;
      // console.log(intregrationsHtml)
   }) : intregrationsHtml += `
   <li class="text-red-500 text-base">No data found</li>
   `

   document.getElementById("modal-body").innerHTML = `
   <div class="md:flex justify-around items-center mt-4 gap-6">
   
      <div class="card md:w-96 bg-base-100 shadow-xl border-2 border-red-500 bg-red-50">
         <div class="card-body">
            
            <p class="card-title my-4">
               ${description}
            </p>

            <div class="grid md:grid-cols-3 gap-4 my-5">
             ${pricingHtml}
            </div>
            
            <div class="md:flex gap-3 justify-around items-center">
               <div class="text-lg mb-2">Features
                  <ul class="py-3 ">
                     ${featureHtml}
                  </ul>
               </div>
               <div class="text-lg mb-2">Intregrations
                  <ul class="py-3">
                  ${intregrationsHtml}
                   </ul>
               </div>
            </div>
         </div>
      </div>
      <div class="card md:w-96 bg-base-100 shadow-xl relative mt-4">
         <figure><img src="${image_link[0]}" /></figure>
         <div class="card-body">
            <p class="card-title">
               ${accuracy.description}
            </p>
            <button class="bg-red-500 text-white  rounded-md absolute right-4 top-2 px-2">
               ${accuracy.score === null ? "No Data Found" : accuracy.score + "% accuracy"} 
            </button>
         </div>
      </div>
   
   </div>
   `
};

loadAIHub(6);