import AbstractView from "./abstract-view.js";
import {isInputTag} from "../utils/common.js";
import {SortType} from "../const.js";

export default class SortView extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return (
      `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
        <span class="trip-sort__item trip-sort__item--day">
          ${this._currentSortType === SortType.DEFAULT ? `Day` : ``}
        </span>

        <div
          class="trip-sort__item trip-sort__item--event"
          data-sort-type="${SortType.DEFAULT}"
        >
          <input
            id="sort-event"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-event"
            ${this._currentSortType === SortType.DEFAULT ? `checked` : ``}
          >
          <label class="trip-sort__btn" for="sort-event">Event</label>
        </div>

        <div
          class="trip-sort__item trip-sort__item--time"
          data-sort-type="${SortType.TIME}"
        >
          <input
            id="sort-time"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-time"
            ${this._currentSortType === SortType.TIME ? `checked` : ``}
          >
          <label class="trip-sort__btn" for="sort-time">
            Time
            <svg
              class="trip-sort__direction-icon"
              width="8"
              height="10"
              viewBox="0 0 8 10"
            >
              <path
                d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"
              />
            </svg>
          </label>
        </div>

        <div
          class="trip-sort__item trip-sort__item--price"
          data-sort-type="${SortType.PRICE}"
        >
          <input
            id="sort-price"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-price"
            ${this._currentSortType === SortType.PRICE ? `checked` : ``}
          >
          <label class="trip-sort__btn" for="sort-price">
            Price
            <svg
              class="trip-sort__direction-icon"
              width="8"
              height="10"
              viewBox="0 0 8 10"
            >
              <path
                d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"
              />
            </svg>
          </label>
        </div>

        <span class="trip-sort__item trip-sort__item--offers">Offers</span>
      </form>`
    );
  }

  isRendered() {
    return this._element !== null;
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (!isInputTag(evt)) {
      return;
    }

    this._callback.sortTypeChange(evt.target.parentElement.dataset.sortType);
  }
}
