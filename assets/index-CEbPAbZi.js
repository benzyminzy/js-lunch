(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const createHeader = () => {
  const header = document.createElement("header");
  header.innerHTML = /*html*/
  `
    <header class="gnb">
      <h1 class="gnb__title text-title">점심 뭐 먹지</h1>
      <button type="button" class="gnb__button" aria-label="음식점 추가">
      <img src="${"/js-lunch/"}assets/add-button.png" alt="음식점 추가">
      </button>
    </header>
  `;
  return header;
};
const createSelectContainer = () => {
  const selectContainer = document.createElement("section");
  selectContainer.classList.add("restaurant-filter-container");
  return selectContainer;
};
const createSelect = ({ name, id, onChange, values, labels }) => {
  const select = document.createElement("select");
  select.classList.add("restaurant-filter");
  select.name = name;
  select.id = id;
  select.addEventListener("change", (e) => {
    onChange == null ? void 0 : onChange(e);
  });
  select.innerHTML = values.map((value) => `<option value="${value}">${labels[value]}</option>`).join("");
  return select;
};
const CATEGORIES = {
  korean: "한식",
  chinese: "중식",
  japanese: "일식",
  western: "양식",
  asian: "아시안",
  etc: "기타"
};
const FILTER_OPTIONS = {
  all: "전체",
  ...CATEGORIES
};
const createCategoryFilter = ({ onChange }) => {
  return createSelect({
    name: "category",
    id: "category-filter",
    values: [...Object.keys(FILTER_OPTIONS)],
    labels: FILTER_OPTIONS,
    onChange: (e) => onChange == null ? void 0 : onChange(e)
  });
};
const SORTING = {
  name: "이름순",
  distance: "거리순"
};
const createSortingFilter = ({ onChange }) => {
  return createSelect({
    name: "sorting",
    id: "sorting-filter",
    values: Object.keys(SORTING),
    labels: SORTING,
    onChange: (e) => onChange == null ? void 0 : onChange(e)
  });
};
const createList = () => {
  const list = document.createElement("li");
  list.classList.add("restaurant");
  return list;
};
const createIcon = ({ alt, src }) => {
  const icon = document.createElement("img");
  icon.src = src;
  icon.alt = alt;
  icon.classList.add("category-icon");
  return icon;
};
const IMAGE_PATHS = {
  [CATEGORIES.korean]: "category-korean.png",
  [CATEGORIES.chinese]: "category-chinese.png",
  [CATEGORIES.japanese]: "category-japanese.png",
  [CATEGORIES.western]: "category-western.png",
  [CATEGORIES.asian]: "category-asian.png",
  [CATEGORIES.etc]: "category-etc.png"
};
const createRestaurantCategoryImage = (category) => {
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("restaurant__category");
  const categoryImage = createIcon({
    src: `${"/js-lunch/"}assets/${IMAGE_PATHS[category]}`,
    alt: category
  });
  imageContainer.append(categoryImage);
  return imageContainer;
};
const createRestaurantNameText = (name) => {
  const subtitle = document.createElement("h3");
  subtitle.classList.add("restaurant__name", "text-subtitle");
  subtitle.textContent = name;
  return subtitle;
};
const createRestaurantDistanceText = (distance) => {
  const body = document.createElement("span");
  body.classList.add("restaurant__distance", "text-body");
  body.textContent = `캠퍼스로부터 ${distance}분 내`;
  return body;
};
const createRestaurantDescriptionText = (description) => {
  const body = document.createElement("p");
  body.classList.add("restaurant__description", "text-body");
  body.textContent = description;
  return body;
};
const createRestaurantInfoSection = (restaurant) => {
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("restaurant__info");
  const name = createRestaurantNameText(restaurant.name);
  const distance = createRestaurantDistanceText(restaurant.distanceMinutes);
  const description = createRestaurantDescriptionText(restaurant.description);
  infoContainer.append(name, distance, description);
  return infoContainer;
};
const createRestaurantListItem = (restaurant) => {
  const restaurantElement = createList();
  const categoryImage = createRestaurantCategoryImage(restaurant.category);
  restaurantElement.append(categoryImage);
  const infoContainer = createRestaurantInfoSection(restaurant);
  restaurantElement.append(infoContainer);
  return restaurantElement;
};
const createRestaurantListGroup = () => {
  const restaurantListGroup = document.createElement("ul");
  restaurantListGroup.classList.add("restaurant-list");
  return restaurantListGroup;
};
const createRestaurantListContainer = () => {
  const restaurantListContainer = document.createElement("section");
  restaurantListContainer.classList.add("restaurant-list-container");
  return restaurantListContainer;
};
const filterListByCategory = (list, category) => {
  return list.filter(
    (item) => category === "all" ? true : item.category === CATEGORIES[category]
  );
};
const sortingList = (list, sorting) => {
  switch (sorting) {
    case "distance":
      return list.sort((a, b) => a.distanceMinutes - b.distanceMinutes);
    case "name":
    default:
      return list.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }
};
const createRestaurantFilterPanel = ({
  onCategoryFilterChange,
  onSortingFilterChange
}) => {
  const restaurantFilterContainer = createSelectContainer();
  const categoryFilter = createCategoryFilter({
    onChange: (e) => onCategoryFilterChange == null ? void 0 : onCategoryFilterChange(e)
  });
  const sortingFilter = createSortingFilter({
    onChange: (e) => onSortingFilterChange == null ? void 0 : onSortingFilterChange(e)
  });
  restaurantFilterContainer.append(categoryFilter, sortingFilter);
  return restaurantFilterContainer;
};
const createRestaurantListView = (data) => {
  const restaurantListContainer = createRestaurantListContainer();
  const restaurantListGroup = createRestaurantListGroup();
  const restaurantElements = data.map((restaurant) => {
    return createRestaurantListItem(restaurant);
  });
  restaurantListGroup.append(...restaurantElements);
  restaurantListContainer.append(restaurantListGroup);
  return restaurantListContainer;
};
const updateRestaurantList = (data) => {
  const restaurantList = document.querySelector(".restaurant-list");
  restaurantList.replaceChildren();
  const restaurantElements = data.map((restaurant) => {
    return createRestaurantListItem(restaurant);
  });
  restaurantList.append(...restaurantElements);
};
const createRestaurantListSection = (data) => {
  let filteredData = data;
  const restaurantFilter = createRestaurantFilterPanel({
    onCategoryFilterChange: (e) => {
      filteredData = filterListByCategory(data, e.target.value);
      updateRestaurantList(filteredData);
    },
    onSortingFilterChange: (e) => {
      const sortedData = sortingList(filteredData, e.target.value);
      updateRestaurantList(sortedData);
    }
  });
  const restaurantList = createRestaurantListView(sortingList(data));
  return [restaurantFilter, restaurantList];
};
const getRestaurantList = async () => {
  return await fetch(`${"/js-lunch/"}mock/db.json`).then(
    (res) => res.json()
  );
};
addEventListener("DOMContentLoaded", async () => {
  const app = document.querySelector("#app");
  const restaurantList = await getRestaurantList();
  const header = createHeader();
  const restaurantListSection = createRestaurantListSection(restaurantList);
  app.append(header, ...restaurantListSection);
});
