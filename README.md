# pull-request-review-stats
Analyze data about pull request reviews


## Initial setup

1. Create a personal access token as explained on GitHub docs:
  [Creating a personal access token for the command line](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line)

    Grant the following permissions to the token:

    ```
    public_repo
    read:user
    ```

2. Save the token to `.token.txt`

## Use

Run the following command:

```
$ node .
```

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
