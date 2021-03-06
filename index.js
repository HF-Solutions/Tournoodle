const tools = new (require('./util/Tools'))()

module.exports = class TourneyGenerator {
  /**
   * The default constructor for the TourneyGenerator class. Accepts all
   * possible options for a given Tournament, even the optional ones. The only
   * required parameters are the competitor count, game name, and tourney type.
   * Everything else is optional and can be set after instantiating the class.
   *
   * @param {TourneyOptions} options
   *
   * @constructor
   */
  constructor (options) {
    if (options !== undefined && options.gameName !== undefined) {
      // Required tournament info
      this.gameName = options.gameName

      // Optional tournament info
      if (options.tourneyType) this.tourneyType = options.tourneyType
      else this.tourneyType = 0 // 0 = Single Elim.; 1 = Double Elim.

      if (options.signupType) this.signupType = options.signupType
      else this.signupType = 0 // 0 = Competitor Signup; 1 = Creator Signup

      if (options.competitorCount) this.competitorCount = options.competitorCount
      else this.competitorCount = -1

      if (options.tourneyName) this.tourneyName = options.tourneyName
      else this.tourneyName = ''

      if (options.tourneyDesc) this.tourneyDesc = options.tourneyDesc
      else this.tourneyDesc = ''

      if (options.hostedDate) this.hostedDate = options.hostedDate
      else this.hostedDate = ''

      if (options.signupDate) this.signupDate = options.signupDate
      else this.signupDate = ''

      if (options.thirdPlaceMatch) this.thirdPlaceMatch = options.thirdPlaceMatch
      else this.thirdPlaceMatch = false

      if (options.randomizeSeeds) this.randomizeSeeds = options.randomizeSeeds
      else this.randomizeSeeds = true

      if (options.competitors) this.competitors = options.competitors
      else this.competitors = []
    } else console.error('You must provide at least a game name as a parameter to the constructor.')
  }

  /**
   * Validates the provided options for required parameters. Returns true or
   * false depending on if the required parameters are there, and are valid
   * input.
   *
   * @param {TourneyOpts} options The options to validate
   *
   * @returns {boolean} Are the required parameters found in the given param
   */
  validateOptions (options) {
    if (options === undefined) return false
    else if (options.gameName === undefined) return false
    else return true
  }

  /**
   * Add the given competitor to the list of stored competitors and return the
   * updated TourneyGenerator object.
   *
   * @param {Competitor} competitor The competitor to add to the generator
   * @returns {TourneyGenerator} The TourneyGenerator object
   */
  addCompetitor (competitor) {
    if (competitor !== undefined || competitor.id !== undefined) {
      // Add the provided competitor to the stored list
      this.competitors.push(competitor)
    } else console.error('The provided competitor was undefined. Please provide a valid object.')

    return this
  }

  /**
   * Generate randomized seeds for the currently stored competitors, assign the
   * values to each one, then return the updated TourneyGenerator.
   *
   * @returns {TourneyGenerator} The generator object with updated seed values
   */
  generateRandomSeeds () {
    const shuffledSeeds = tools.shuffleArray(this.seedRange)

    this.competitors.forEach((val, index) => {
      val.seed = shuffledSeeds[index]
    })

    return this
  }

  /**
   * Displays the current list of competitors by writing console.log or if a
   * Stream is provided, by writing to it.
   *
   * @param {WritableStream} [stream] The stream to display the competitors (defaults to console.log)
   */
  displayCompetitors (stream) {
    this.competitors.forEach((competitor, index) => {
      let output = `Competitor #${index} - ${competitor.id}`
      if (competitor.seed !== -1) output += ` - Seed = ${competitor.seed}`
      output += `\n`

      if (stream) stream.write(output)
      else console.log(output)
    })
  }

  // #region Tournament Getters
  /**
   * Creates an array the size (n) of how many competitors are currently stored,
   * and then returns it. If no competitors are currently stored, an empty array
   * is returned.
   *
   * @returns {number[]} Array of seed numbers
   */
  get seedRange () {
    if (this.competitors !== undefined) {
      let range = []

      for (let x = 0; x < this.competitors.length; x++) {
        range.push(x)
      }

      return range
    } else return []
  }

  /**
   * Gets a competitor by index value.
   *
   * @param {number} index The index of the competitor to retrieve
   *
   * @returns {Competitor}
   */
  getCompetitor (index) {
    return this.competitors[index]
  }

  getCompetitorById (id) {
    for (let x = 0; x < this.competitors.length; x++) {
      if (this.competitors[x].id === id) return this.competitors[x]
    }
  }
  // #endregion Tournament Getters
}

// #region JSDocs Type Info
/**
 * @typedef {object} Competitor
 * @property {string} id The user id of the competitor
 * @property {number} [seed] The seed/rank of the competitor
 */
/**
 * @typedef {object} TourneyOptions
 * @property {string} gameName The name of the game being played
 * @property {number} [tournamentType] The type of tournament hosted (0 = Single Elim., 1 = Double Elim.)
 * @property {string} [tourneyName] The name of this specific tournament
 * @property {number} [competitorCount] The amount of individuals competing
 * @property {string} [tourneyDesc] A description of the tournament
 * @property {string} [signupDate] The date signups are unlocked
 * @property {string} [hostedDate] The date the tournament will be hosted
 * @property {number} [signupType] The type of signup (0 = Competitor Signup, 1 = Creator Signup)
 * @property {boolean} [thirdPlaceMatch] True or false, should a third place be determined
 * @property {boolean} [randomizeSeeds] True or false, should the competitor seeds be randomized
 * @property {Competitor[]} [competitors] An array containing the competitors for this tournament
 */
// #endregion JSDocs Type Info
