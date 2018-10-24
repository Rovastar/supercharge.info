import EventBus from "../../util/EventBus";
import QueryStrings from "../../common/QueryStrings";
import userConfig from "../../common/UserConfig";
import Units from "../../util/Units";


//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// conversion methods
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const METERS_PER_MILE = 1609.34;
const METERS_PER_KM = 1000.0;

const milesToMeters = (miles) => Math.round(METERS_PER_MILE * miles);
const milesToKilometers = (miles) => Math.round(METERS_PER_MILE * miles / METERS_PER_KM);
const metersToMiles = (meters) => Math.round(meters / METERS_PER_MILE);
const metersToKilometers = (meters) => Math.round(meters / METERS_PER_KM);
const kilometersToMeters = (kilometers) => Math.round(kilometers * METERS_PER_KM);

const MILES_MIN = 0;
const MILES_MAX = 350;
const METERS_DEFAULT = milesToMeters(175);

class RangeModel {

    /**
     * always takes *meters* as the initial magnitude, but the initial displayUnit value can be either unit.
     */
    constructor() {
        const rangeMi = QueryStrings.getRangeMi();
        const rangeKm = QueryStrings.getRangeKm();

        if (rangeMi) {
            this.rangeMeters = milesToMeters(rangeMi);
            this.displayUnit = Units.MI;
        } else if (rangeKm) {
            this.rangeMeters = kilometersToMeters(rangeKm);
            this.displayUnit = Units.KM;
        } else {
            this.rangeMeters = METERS_DEFAULT;
            this.displayUnit = Units.MI;
        }
    }


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    getCurrent() {
        if (this.displayUnit.isMiles()) {
            return metersToMiles(this.rangeMeters);
        } else {
            return metersToKilometers(this.rangeMeters);
        }
    }

    setCurrent(newRange) {
        if (this.displayUnit.isMiles()) {
            this.rangeMeters = milesToMeters(newRange);
        } else {
            this.rangeMeters = kilometersToMeters(newRange);
        }
        RangeModel.fireRangeChangedEvent();
    }

    getMin() {
        if (this.displayUnit.isMiles()) {
            return MILES_MIN;
        } else {
            return milesToKilometers(MILES_MIN);
        }
    };

    getMax() {
        if (this.displayUnit.isMiles()) {
            return MILES_MAX;
        } else {
            return milesToKilometers(MILES_MAX);
        }
    };

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // getters/setters
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    getRangeMeters() {
        return this.rangeMeters;
    };

    setDisplayUnit(newUnit) {
        this.displayUnit = newUnit;
        RangeModel.fireUnitChangedEvent();
        userConfig.setUnit(newUnit)
    };

    getDisplayUnit() {
        return this.displayUnit;
    };


    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // events
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    static fireRangeChangedEvent() {
        EventBus.dispatch("range-model-range-changed-event");
    };

    static fireUnitChangedEvent() {
        EventBus.dispatch("range-model-unit-changed-event");
    };


}

export default new RangeModel();