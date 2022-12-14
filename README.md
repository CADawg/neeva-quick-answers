# Neeva Quick Answers
DuckDuckGo-style Instant answers for @neevaco (Unofficial)

## Installation

1. Install tampermonkey.
2. Visit https://git.dbuidl.com/Snaddyvitch-Dispenser/neeva-quick-answers/raw/branch/main/neevaquickanswers.user.js to install it (click install when tampermonkey asks)
3. search `sha256 test` as your first query (the first query has to use a page which has no special results at the top due to the way it clones the elements. (Also needs to be done on subsequent plugin version updates)

If you load it on a page with special elements first, go into the localStorage in your browser (while on neeva) and delete the `instantAnswerDetail` and `instantAnswerVersion` values and then repeat step 3 above to get a correct instant answer.

## Usage:

### `sha256 string to hash`

![Untitled](https://user-images.githubusercontent.com/28988626/207709068-6e220ff2-3903-451a-93c5-5681e77af946.png)

### `sha512 string to hash`

![Untitled](https://user-images.githubusercontent.com/28988626/207709182-36f319e6-6c49-4df0-b5a6-03680481edc0.png)

### `string%20test`

![Untitled](https://user-images.githubusercontent.com/28988626/207709567-02ec6381-ad2c-465e-a8c2-5719ab63147b.png)

### `urlencode non url encoded string £€$`

![Untitled](https://user-images.githubusercontent.com/28988626/207709735-90fff518-c8fd-4a0e-aa7c-b014c84cfb37.png)

## Contributing:

Contributions are always welcomed, including additional instant answers. Simply copy an existing one and replace the parts you need to make it work.

### Examples of instant answer code

See https://github.com/Snaddyvitch-Dispenser/neeva-quick-answers/blob/main/neevaquickanswers.user.js#L56-L84 for the 2 different formats of instant answers.
