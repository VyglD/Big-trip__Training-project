import InformationView from "../view/information-view.js";
import CostView from "../view/cost-view.js";
import RouteView from "../view/route-view.js";
import AbstractPointsPresenter from "./abstract-points-presenter.js";
import {render, RenderPosition, append, replace} from "../utils/render.js";
import {EventType, UpdateType} from "../const.js";

export default class InformationPresenter extends AbstractPointsPresenter {
  constructor(informationContainer, pointsModel, filterModel) {
    super(pointsModel, filterModel);
    this._container = informationContainer;

    this._updateViews = this._updateViews.bind(this);

    this._pointsModel.addObserver(this._updateViews);
    this._filterModel.addObserver(this._updateViews);
  }

  init() {
    this._informationComponent = new InformationView();
    this._routeComponent = new RouteView(this._getAllPoints());
    this._costComponent = new CostView(this._getPoints());

    append(this._informationComponent, this._routeComponent);
    append(this._informationComponent, this._costComponent);

    render(
        this._container,
        this._informationComponent,
        RenderPosition.AFTERBEGIN
    );
  }

  _updateViews(event) {
    if (event.updateType !== UpdateType.MAJOR) {
      return;
    }

    if (event.eventType === EventType.POINT) {
      this._updateRoute();
    }

    this._updateCost();
    this._updateRoute();
  }

  _updateCost() {
    let prevCostComponent = this._costComponent;

    this._costComponent = new CostView(this._getPoints());

    replace(this._costComponent, prevCostComponent);

    prevCostComponent = null;
  }

  _updateRoute() {
    let prevRouteComponent = this._routeComponent;

    this._routeComponent = new RouteView(this._getAllPoints());

    replace(this._routeComponent, prevRouteComponent);

    prevRouteComponent = null;
  }
}
