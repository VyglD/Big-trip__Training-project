import SortView from "../view/sort.js";
import DaysListView from "../view/days-list.js";
import DayView from "../view/day.js";
import PointsListView from "../view/points-list.js";
import PointView from "../view/point.js";
import PointEditView from "../view/point-edit.js";
import NoPointsView from "../view/no-points.js";
import {render, RenderPosition, replace, append} from "../utils/render.js";
import {isEscEvent, getTimeInterval} from "../utils/common.js";
import {SortType} from "../data.js";

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._currentSortType = SortType.DEFAULT;

    this._noPointsComponent = new NoPointsView();
    this._sortComponent = new SortView();
    this._daysListComponent = new DaysListView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._createTripSplit();

    this._renderTrip();
  }

  _renderNoPoints() {
    render(
        this._tripContainer,
        this._noPointsComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderSortComponent() {
    render(
        this._tripContainer,
        this._sortComponent,
        RenderPosition.BEFOREEND
    );

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _getPoint(pointData) {
    const pointComponent = new PointView(pointData);
    const pointEditComponent = new PointEditView(pointData);

    const replacePointToForm = () => {
      replace(pointEditComponent, pointComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, pointEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (isEscEvent(evt)) {
        evt.preventDefault();
        replaceFormToPoint();
      }
    };

    pointComponent.setEditClickHandler(replacePointToForm);
    pointEditComponent.setFormSubmitHandler(replaceFormToPoint);
    pointEditComponent.setFormCloseHandler(replaceFormToPoint);

    return pointComponent;
  }

  _createDay(date, index) {
    const isSort = date === `sort` ? true : false;
    const tripDayComponent = new DayView(date, index, !isSort);
    const pointsListComponent = new PointsListView(index);

    append(tripDayComponent, pointsListComponent);

    this._tripSplit.get(date).forEach((pointData) => {
      append(pointsListComponent, this._getPoint(pointData));
    });

    append(this._daysListComponent, tripDayComponent);
  }

  _createDaysList() {
    Array.from(this._tripSplit.keys()).forEach((key, index) => {
      this._createDay(key, index + 1);
    });
  }

  _createSplitBySort(points) {
    this._tripSplit = new Map([[`sort`, points]]);
  }

  _renderTripBoard() {
    this._createDaysList();

    render(
        this._tripContainer,
        this._daysListComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderTrip() {
    if (!this._points.length) {
      this._renderNoPoints();
      return;
    }

    this._renderSortComponent();
    this._renderTripBoard();
  }

  _createSplitByDays() {
    const tripDays = new Map();

    for (const point of this._points.slice()) {
      const date = new Date(point.timeStart).setHours(0, 0, 0, 0);

      if (tripDays.has(date)) {
        tripDays.get(date).push(point);
      } else {
        tripDays.set(date, [point]);
      }
    }

    this._tripSplit = tripDays;
  }

  _createTripSplit() {
    switch (this._currentSortType) {
      case SortType.TIME:
        this._createSplitBySort(this._getPointsByTime());
        break;
      case SortType.PRICE:
        this._createSplitBySort(this._getPointsByPrice());
        break;
      default:
        this._createSplitByDays();
    }
  }

  _getPointsByPrice() {
    return this._points.slice()
      .sort((point1, point2) => point2.price - point1.price);
  }

  _getPointsByTime() {
    return this._points.slice()
      .sort((point1, point2) => getTimeInterval(point2) - getTimeInterval(point1));
  }

  _clearTrip() {
    this._daysListComponent.getElement().innerHTML = ``;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._clearTrip();
    this._currentSortType = sortType;
    this._createTripSplit();
    this._renderTripBoard();
  }
}