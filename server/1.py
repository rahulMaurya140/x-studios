# -*- coding: utf-8 -*-
from playwright.sync_api import Playwright, sync_playwright, expect
# storing the result 
allTweetsList = []


# *****************************************************************************
# receiving data from js i.e. username and password
import sys
import ast
inputFromJS = ast.literal_eval(sys.argv[1])
# twitterUserName = "ElvishInsaan"
twitterUserName = inputFromJS[0].strip()
# twitterPassword = "Gautam@962"
twitterPassword = inputFromJS[1].strip()

# print("Inside")
#  ****************************************************************************

# function to convert text to number for twitter 
def textNumToIntNum(str):
    if str == '':
        return 0
    # e.g. 27.5K
    elif str[-1] == 'K':
        return int(float(str.replace('K', '')) * 1000)
    # e.g. 1.2M
    elif str[-1] == 'M':
        return int(float(str.replace('M', '')) * 1000000)
    # e.g. 233
    elif len(str) <= 3:
        return int(str)
    # including comma e.g. 2,332
    elif len(str) == 5:
        return int(str.replace(',', ''))

    return -1

# if don't want to run the scrapping function, using some pre-scrapped list to check the sql. 
# allTweetsList = [['2023-09-24T05:27:15.000Z', 'India needs more job providers than job seekers.', 0, 0, 0, '71'], ['2023-08-25T23:31:41.000Z', '“someday a lizard in human form may appear with the name Markon Zucks and he may copy all of the things i’m planning to build ”', '1', '1', '6', '279'], ['2023-08-23T12:48:14.000Z', 'We landed on moon. \n#Chandrayaan3Landing', 0, 0, '1', '66'], ['2023-08-21T15:37:24.000Z', 'The first rejection is always special. Today I got rejected from a company, but their are always positives:\nLearnt a lot of new things. \n#rejected #SoftwareEngineering', 
# 0, 0, 0, '67'], ['2023-08-18T17:46:48.000Z', 'Britishers took about 45$ trillion in 200 years, but now also bharat  has greater economy than britishers. \nचोरी का पैसा मुर्दे का | \n\n\n@narendramodi\n  \n@RishiSunak\n \n\n#Bhartiy e #Indian', 0, 0, 0, '43'], ['2023-08-14T18:00:24.000Z', "#BiggBossOTT2 | Although you didn't clinch the victory, #AbhishekMalhan, you've won countless hearts with your incredible journey. \nYour determination and resilience have  left a lasting impression. You gave your all, and that's what truly matters.  #BiggBossOTT2Finale", '122', '2,285', '7,443', '119.9K'], ['2023-08-14T13:29:14.000Z', 'Sources say Puneet Superstar is not invited in the \n@BiggBoss\n  finale. \n#AbhishekWins', 0, 0, 0, '42'], ['2023-08-06T09:14:01.000Z', 'Abhishek Trending in world wide.\n\nThis  is power of panda gang .\nABHISHEK deserve this .\n\nManisha also trending in worldwide.\n\n#abhisha trending everywhere.\n\nRESPECT BUTTON FOR #ABHISHA\n\nABHISHEK FOR THE WIN', '122', '2,248', '1,380', '37.2K'], ['2023-07-22T20:00:16.000Z', "Aptitude, during online assessment really makes it difficult to get shortlisted sometimes. \nI've appeared for a few OA rounds where many Aptitude questions were asked. \nI'm sharing my preparation resource for Aptitude based on the topics I've encountered in any OA till now.", '17', '101', '471', '55.8K'], ['2023-07-16T08:30:58.000Z', 'Popular websites where you can find interview experiences shared by candidates :', '9', '110', '519', '60.9K']]

# scrapper function
def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://twitter.com/")
    page.get_by_test_id("loginButton").click()
    page.get_by_label("Phone, email, or username").click()
    page.get_by_label("Phone, email, or username").fill(twitterUserName)
    page.get_by_role("button", name="Next").click()
    page.get_by_label("Password", exact=True).fill(twitterPassword)
    page.get_by_test_id("LoginForm_Login_Button").click()
    page.get_by_test_id("AppTabBar_Profile_Link").click()

    # Getting to the profile page
    page.wait_for_selector('article[data-testid= "tweet"]', timeout=60000)
    elements = page.query_selector_all('article[data-testid= "tweet"]')

    # to get the break condition, if time stamp is repeated 
    isVisited = set()

    # move on until find the same timestamp again 
    while True:

        visited = False

        # Traversing each tweet seen on the current page
        for element in elements:
            
            # finding the time stamp
            timeStamp = element.query_selector("time").get_attribute("datetime")

            # if present in set then break 
            if timeStamp in isVisited:
                visited = True
                break

            # else put in the set 
            isVisited.add(timeStamp)

            # storing one tweet all data in a list
            oneTweetList = []

            # printing the time stamp
            # print("This is the timestamp", timeStamp)
            oneTweetList.append(timeStamp)

            # main text of tweet 
            tweetText = element.query_selector("div[data-testid='tweetText']")
            # print("Tweet Text:", tweetText.inner_text())
            oneTweetList.append(tweetText.inner_text())

            # getting to all the tweet stats
            tweetStats = element.query_selector_all("span[data-testid='app-text-transition-container']")
            stats = 0
            for tweetStat in tweetStats:
                if stats == 0:
                    # print("comments: ", tweetStat.inner_text())
                    oneTweetList.append(textNumToIntNum(tweetStat.inner_text()))
                elif stats == 1:
                    # print("retweets: ", tweetStat.inner_text())
                    oneTweetList.append(textNumToIntNum(tweetStat.inner_text()))
                elif stats == 2:
                    # print("likes: ", tweetStat.inner_text())
                    oneTweetList.append(textNumToIntNum(tweetStat.inner_text()))
                else:
                    # print("views: ", tweetStat.inner_text())
                    oneTweetList.append(textNumToIntNum(tweetStat.inner_text()))
                stats = stats + 1

            allTweetsList.append(oneTweetList)
            
        if visited == True:
            # print("Inside")
            break
        
        # scrolling down 
        page.evaluate('window.scrollTo(0, document.body.scrollHeight);')

        # again selecting the new elements after scrolling 
        page.wait_for_selector('article[data-testid= "tweet"]', timeout=60000)
        elements = page.query_selector_all('article[data-testid= "tweet"]')
        # break

    # print("end")
    # # ---------------------
    context.close()
    browser.close()

# running the scrapper function
with sync_playwright() as playwright:
    run(playwright)

# printing all the tweets 
# print(allTweetsList)


# **********************************************************************************************************


# Now, it's time to dump the data into mysql 
import mysql.connector
import pandas as pd
from datetime import datetime

#establishing the connection
conn = mysql.connector.connect(
   user='root', password='root', host='127.0.0.1', database='python_to_sql'
)

#Setting auto commit false
conn.autocommit = True

# Creating a cursor object using the cursor() method
cursor = conn.cursor()

# using twitter user name as table name of sql, not 
# used password because it has special characters that
# cannot be used as mysql table name. 

# twitterUserName = "ElvishInsaan"
# twitterPassword = "Gautam962"
# tableName = twitterUserName + "AND" + twitterPassword
tableName = twitterUserName

#Dropping table if already exists.
cursor.execute(f"DROP TABLE IF EXISTS {tableName}")

#Creating table as per requirement
cursor.execute(f'''CREATE TABLE {tableName}(
   TimeStamp DATETIME NOT NULL,
   Tweet TEXT,
   Comments BIGINT,
   Retweets BIGINT,
   Likes BIGINT,
   Views BIGINT    
)''')

# data = {
#     'FIRST_NAME': ['Sexa']
# }

# data = [
#     ['Sexa']
# ]

# df = pd.DataFrame(data)
# print(df)
# df.to_sql("Fatima", conn, index = False)


# Preparing SQL queries to INSERT a record into the database.
for value in allTweetsList:

    # converting string to datetime. 
    originalTimeStamp = datetime.strptime(value[0], '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y-%m-%d %H:%M:%S')

    # using insert command to add rows into the table in mysql. 
    insertQuery = insertQuery = f'''INSERT INTO {tableName}(TimeStamp, Tweet, Comments, Retweets, Likes, Views) VALUES (%s, %s, %s, %s, %s, %s)'''
    cursor.execute(insertQuery, (originalTimeStamp, value[1], value[2], value[3], value[4], value[5],))


# Commit your changes in the database
conn.commit()

#Closing the connection
conn.close()


# ************************************************************************
dataForJS = 'Success'

print(dataForJS)

