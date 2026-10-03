/**
 * The start sequence.
 *
 * A Formula 1 race does not begin when the formation lap ends. It begins when the
 * five red lights on the gantry go out, one at a time, and then all together -- and
 * until that moment every car is held.
 *
 * This matters for more than flavour:
 *
 * **The player's throttle has to be ignored.** Without a hold, a player who is
 * already holding throttle from the moment the race loads launches off the line the
 * instant the scene appears, which is both unfair and a first impression of the game
 * being broken. Ignoring input is the correct behaviour, not a restriction.
 *
 * **The AI has to be held too**, or the field accelerates away on its own and the
 * player is left to chase a race that has already begun. All cars are held together,
 * so the start is a start.
 *
 * ## The lights
 *
 * Five pairs, lit one per second, then all out. The delay between the first light
 * and lights-out is therefore six seconds, and a driver who reacts slowly to "lights
 * out" is genuinely slower off the line -- which is the entire point of the format,
 * and the reason reaction time is a meaningful skill in this game rather than a
 * stat.
 *
 * Deliberately *not* modelled: the five-second penalty for jumping the start. That
 * needs a jump-start judgement, which needs a rules layer this game does not have,
 * and a half-measure would be worse than none.
 */

/** Seconds between each pair of lights coming on. */
export const LIGHT_INTERVAL = 1.0;

/** How many pairs of lights the gantry has. */
export const LIGHT_COUNT = 5;

/**
 * How long after lights-out the cars are actually released.
 *
 * Real starts have a small delay between the lights going out and the field moving,
 * because drivers cannot react instantly. Without it, "lights out" and "the car moves"
 * are the same instant, and the sequence has no tension at the only moment it exists
 * to create.
 */
export const RELEASE_DELAY = 0.35;

/** The states a start sequence moves through, in order. */
export const START_STATE = {
  /** Waiting for the field to be ready; no lights yet. */
  pending: 'pending',
  /** Lights coming on one at a time. */
  lights: 'lights',
  /** All five lit; waiting out the reaction delay. */
  hold: 'hold',
  /** Lights out, cars released. */
  green: 'green'
};

export class StartSequence {
  /**
   * @param {object} [options]
   * @param {number} [options.delayBefore] time on the grid before the first light
   * @param {boolean} [options.enabled] set false for a rolling or standing start with
   *   no lights, such as a time trial
   */
  constructor({ delayBefore = 1.2, enabled = true } = {}) {
    this.enabled = enabled;
    this.delayBefore = delayBefore;
    this.elapsed = 0;
    this.state = enabled ? START_STATE.pending : START_STATE.green;
    this.lightsOn = 0;
  }

  /** True while cars must stay where they are. */
  get holding() {
    return this.state !== START_STATE.green;
  }

  /**
   * Advance the sequence.
   * @param {number} dt seconds
   */
  update(dt) {
    if (!this.enabled || this.state === START_STATE.green) return;

    this.elapsed += dt;

    if (this.elapsed < this.delayBefore) {
      this.state = START_STATE.pending;
      this.lightsOn = 0;
      return;
    }

    // Seconds since the first light came on.
    const sinceFirst = this.elapsed - this.delayBefore;

    if (sinceFirst < LIGHT_COUNT * LIGHT_INTERVAL) {
      this.state = START_STATE.lights;
      /*
       * `Math.floor(sinceFirst / interval) + 1`, and the boundary is the *last* light
       * coming on rather than the lights going out.
       *
       * Off by one here and the fifth light never appears: the count of completed
       * intervals reaches LIGHT_COUNT one second before the fifth pair should light up,
       * so the sequence goes straight from four lights to the hold. Caught by a test
       * asserting the lights come on as 1,2,3,4,5.
       */
      this.lightsOn = Math.min(Math.floor(sinceFirst / LIGHT_INTERVAL) + 1, LIGHT_COUNT);
      return;
    }

    // All five lit and then out.
    this.state = START_STATE.hold;
    this.lightsOn = 0;
    if (sinceFirst >= LIGHT_COUNT * LIGHT_INTERVAL + RELEASE_DELAY) {
      this.state = START_STATE.green;
    }
  }

  /**
   * How long until the cars are released, seconds.
   *
   * Used by the HUD so the sequence can be shown as a countdown as well as a light
   * gantry. Rounded up, because showing "0" while the player is still held is worse
   * than showing "1".
   */
  get remaining() {
    if (!this.enabled || this.state === START_STATE.green) return 0;
    const sinceFirst = Math.max(0, this.elapsed - this.delayBefore);
    const releaseAt = LIGHT_COUNT * LIGHT_INTERVAL + RELEASE_DELAY;
    return Math.max(0, releaseAt - sinceFirst);
  }
}