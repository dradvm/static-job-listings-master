const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
var getDataTagSelected = (data, tagElementsSelected) => {
    var dataReturn = data
    for (const item of tagElementsSelected) {
        dataReturn = dataReturn.filter((itemData) => itemData.role == item || itemData.level == item || itemData.languages.includes(item) || itemData.tools.includes(item) )
    }
    return dataReturn.map((itemData) => itemData.id - 1)
}
var renderData = (indexElements, staticItemELement) => {
    for (var i = 0; i< staticItemELement.length; i++ ) {
        if (!indexElements.includes(i)) {
            if (!staticItemELement[i].classList.contains("static-item--disabled")) {
                staticItemELement[i].classList.add("static-item--disabled")
            }
        }
        else {
            staticItemELement[i].classList.remove("static-item--disabled")
        }
    }
}

if (window.matchMedia("(max-width: 739px)").matches) {
    $(".static-container").style.minHeight = `${window.innerHeight - $(".static-img--mobile").height + 10}px`
}
else {
    $(".static-container").style.minHeight = `${window.innerHeight - $(".static-img--desktop").height + 10}px`
}
fetch('./data.json')
        .then((res) => res.json())
        .then((data) => {
            var staticItemELements = data.map((item) => {
                var returnValue = ""
                var New = item.new ? `<div class="static-item__new">New!</div>` : ""
                var Featured = item.featured ? `<div class="static-item__featured">Featured</div>` : ""
                var allTags = [item.role, item.level, ...item.languages, ...item.tools].reduce((out, item) => out + `<div class="static-tag__item">${item}</div>`, "")
                var check = New && Featured ? `static-item--checked`: ""
                returnValue += 
                `<div class="static-item ${check}">
                    <div class="static-item__info">
                    <img src="${item.logo}" alt="" class="static-item__logo">
                    <div class="static-item__wrap">
                        <div class="static-item__wrap">
                            <div class="static-item__company">${item.company}</div>
                        <div class="static-item__wrap">
                            ${New}
                            ${Featured}
                        </div>
                        </div>
                        <div class="static-item__wrap">
                            <div class="static-item__position">${item.position}</div>
                        </div>
                        <div class="static-item__wrap">
                            <div class="static-item__postedAt">${item.postedAt}</div>
                            &bull;
                            <div class="static-item__contract">${item.contract}</div>
                            &bull;
                            <div class="static-item__location">${item.location}</div>  
                        </div>
                    </div>
                    </div>
                    <div class="static-item__tag">
                        ${allTags}
                    </div>
                </div>`
                return returnValue
            })
            $(".static-item__container").innerHTML = staticItemELements.reduce((out, item) => out+= item ,"")
            var allTagElements = $$(".static-tag__item")
            var filterElement = $(".static-filter")
            var clearBtn = $(".static-filter__clear")
            var tagContainer = $(".static-filter__all-tag")
            for (const item of allTagElements) {
                item.addEvent
                item.onclick = () => {
                    filterElement.style.display = "flex"
                    var itemElement = 
                    `<div class="static-filter__tag-item">
                        <span>${item.innerText}</span>
                        <i class="fa-solid fa-xmark"></i>
                    </div>`
                    if (!tagContainer.innerHTML.includes(itemElement)) {
                        tagContainer.innerHTML+= itemElement
                        renderData(getDataTagSelected(data, Array.from($$(".static-filter__tag-item")).map((item) => item.innerText)), $$(".static-item"))
                    }
                    for (const item of $$(".static-filter__tag-item")) {
                        item.querySelector("i").onclick = () => {
                            item.remove()
                            if (!$$(".static-filter__tag-item").length) {
                                filterElement.style.display = "none"
                            }
                            
                        renderData(getDataTagSelected(data, Array.from($$(".static-filter__tag-item")).map((item) => item.innerText)), $$(".static-item"))
                        }
                    }
                }
            }
            clearBtn.onclick = () => {
                filterElement.style.display = "none"
                for (const item of $$(".static-filter__tag-item")) {
                    item.remove()
                }
                renderData(getDataTagSelected(data, Array.from($$(".static-filter__tag-item")).map((item) => item.innerText)), $$(".static-item"))
            }
        })