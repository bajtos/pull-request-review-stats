# pull-request-review-stats
Analyze data about pull request reviews

## Use

1. Copy the GraphQL query from [lib/query.graphql](./lib/query.graphql).
2. Run the query using [GitHub's GraphQL Explorer](https://developer.github.com/v4/explorer/)
3. Copy the response and save it to [data.json](./data.json)
4. Crunch the data - run `node .`

## Example output

```
**2019 week 2**
              bajtos 33  #################################
            b-admike 8   ########
         raymondfeng 4   ####
            jannyHou 3   ###
              dhmlau 1   #
      angelwithaneye 1   #
         nabdelgadir 1   #
         hacksparrow 1   #
         JesusTheHun 1   #

**2019 week 3**
              bajtos 26  ##########################
         raymondfeng 15  ###############
            b-admike 4   ####
         hacksparrow 3   ###
            jannyHou 2   ##
         nabdelgadir 1   #

**2019 week 4**
              bajtos 14  ##############
         raymondfeng 10  ##########
            jannyHou 4   ####
              dhmlau 3   ###
             emonddr 3   ###
         hacksparrow 3   ###
         nabdelgadir 2   ##
            b-admike 2   ##

**2019 week 5**
         raymondfeng 29  #############################
              bajtos 21  #####################
            b-admike 11  ###########
              dhmlau 3   ###
         nabdelgadir 2   ##
            jannyHou 2   ##
         hacksparrow 2   ##
```

## License

MIT
