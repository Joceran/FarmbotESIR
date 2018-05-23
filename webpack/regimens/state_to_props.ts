import { Everything } from "../interfaces";
import { Props, RegimenItem, RegimenItemCalendarRow, CalendarRow } from "./interfaces";
import {
  selectAllSequences,
  selectAllRegimens,
  maybeGetSequence,
  maybeGetRegimen,
  findId,
  findSequence
} from "../resources/selectors";
import { TaggedRegimen } from "../resources/tagged_resources";
import { duration } from "moment";
import * as moment from "moment";
import { ResourceIndex } from "../resources/interfaces";
import { randomColor } from "../util";
import * as _ from "lodash";

export function mapStateToProps(props: Everything): Props {
  const { resources, dispatch, bot } = props;
  const { weeks, dailyOffsetMs, selectedSequenceUUID, currentRegimen } =
    resources.consumers.regimens;
  const { index } = resources;
  const current = maybeGetRegimen(index, currentRegimen);
  const calendar = current ?
    generateCalendar(current, index, dispatch) : [];

  return {
    dispatch: props.dispatch,
    sequences: selectAllSequences(index),
    resources: index,
    auth: props.auth,
    current,
    regimens: selectAllRegimens(index),
    selectedSequence: maybeGetSequence(index, selectedSequenceUUID),
    dailyOffsetMs,
    weeks,
    bot,
    calendar
  };
}

/** Formatting of calendar row dates. */
const FMT = "h:mm a";
const SORT_KEY: keyof RegimenItemCalendarRow = "sortKey";

/** Does all the heavy lifting related to joining regimen items with their
 * appropriate sequence meta data like "sequence name" and the like.
 */
function generateCalendar(regimen: TaggedRegimen,
  index: ResourceIndex,
  dispatch: Function): CalendarRow[] {
  const mapper = createRows(index, dispatch, regimen);
  const rows = regimen.body.regimen_items.map(mapper);
  const dict = _.groupBy(rows, "day");
  const makeRows = (day: string): CalendarRow => ({ day: day, items: dict[day] });
  const days = _(dict)
    .keys()
    .map(x => parseInt(x))
    .sort((a, b) => a - b)
    .map(x => "" + x)
    .value();
  return days
    .map(makeRows)
    .map((x) => {
      x.items = _(x.items).sortBy(SORT_KEY).value();
      return x;
    });
}

const createRows = (index: ResourceIndex, dispatch: Function, regimen: TaggedRegimen) =>
  (item: RegimenItem): RegimenItemCalendarRow => {
    const uuid = findId(index, "Sequence", item.sequence_id);
    const sequence = findSequence(index, uuid);
    const { time_offset } = item;
    const d = duration(time_offset);
    const { name } = sequence.body;
    const color = sequence.body.color || randomColor();
    const hhmm = moment({ hour: d.hours(), minute: d.minutes() }).format(FMT);
    const day = Math.floor(duration(time_offset).asDays()) + 1;
    return { name, hhmm, color, day, dispatch, regimen, item, sortKey: time_offset };
  };
