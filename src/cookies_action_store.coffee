class CookiesActionStore

	load: =>
		@data = try
			JSON.parse(jQuery.cookie(Settings.INFO_COOKIE_NAME))
		catch e
			console.log("Error while loading actions data from cookies: #{e}") if Settings.is_debug()
			[]
		@data

	current: => @data || load()

	save: =>
		console.log("Saving tracking data: #{@data}") if Settings.is_debug()
		if @data.length == 0
			jQuery.cookie(Settings.INFO_COOKIE_NAME, null)
		else
			jQuery.cookie(Settings.INFO_COOKIE_NAME, JSON.stringify(@data),
				expires: 365 * 10, path: '/', domain: ".#{location.host}")

	newId: => @generate(2) + @current().length

	addAction: (type, params) =>
		@current().push([@newId(), type, params])
		@save()

	getAction: (id) =>
		@getActions().filter((_, e) -> e[0] == id)[0]

	getActions: =>
		@current()

	deleteAction: (id) =>
		@data = @current().filter((_, e) -> e[0] != id)
		@save()

	generate: (count) =>
		[1..count].map(() -> @ALPHABET.charAt(Math.floor(Math.random() * @alphabet.length))).reduce((a, b) -> a + b)