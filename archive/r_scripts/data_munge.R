#! /usr/local/bin/Rscript

library(dplyr)
library(jsonlite)

okcbudget <- read.csv("../data/okc_fy2015_budget_detail.csv")



forbubble <- okcbudget %>% group_by(FundDescription) %>%
        summarise(Total=sum(FY2015.Budget))

write.csv(forbubble,"../data/generated/by_fund.csv",row.names=FALSE)




forbubble <- okcbudget %>% group_by(OperatingUnitDescription) %>%
        summarise(Total=sum(FY2015.Budget))

write.csv(forbubble,"../data/generated/by_operating_unit.csv",row.names=FALSE)




forbubble <- okcbudget %>% group_by(ProgramName) %>%
        summarise(Total=sum(FY2015.Budget))

write.csv(forbubble,"../data/generated/by_program.csv",row.names=FALSE)





forbubble <- okcbudget %>% group_by(LOBName) %>%
        summarise(Total=sum(FY2015.Budget))

write.csv(forbubble,"../data/generated/by_lob.csv",row.names=FALSE)




forbubble <- okcbudget %>% group_by(Account.Description) %>%
        summarise(Total=sum(FY2015.Budget))

write.csv(forbubble,"../data/generated/by_account.csv",row.names=FALSE)









forbubble <- okcbudget %>% group_by(FundDescription,OperatingUnitDescription) %>%
        summarise(Total=sum(FY2015.Budget))

write.csv(forbubble,"../data/generated/by_fund_and_operating_unit.csv",row.names=FALSE)




forbubble <- okcbudget %>% group_by(FundDescription,ProgramName) %>%
        summarise(Total=sum(FY2015.Budget))

write.csv(forbubble,"../data/generated/by_fund_and_program.csv",row.names=FALSE)



forbubble <- okcbudget %>% group_by(FundDescription,LOBName) %>%
        summarise(Total=sum(FY2015.Budget))

write.csv(forbubble,"../data/generated/by_fund_and_lob.csv",row.names=FALSE)



forbubble <- okcbudget %>% group_by(FundDescription,Account.Description) %>%
        summarise(Total=sum(FY2015.Budget))

write.csv(forbubble,"../data/generated/by_fund_and_account.csv",row.names=FALSE)









fortree <- okcbudget %>% 
        group_by(FundDescription,OperatingUnitDescription,ProgramName,LOBName,Account.Description) %>%
        summarise(Total=sum(FY2015.Budget))

write.csv(fortree,"../data/generated/tree.csv",row.names=FALSE)



myjson <- toJSON(fortree, pretty=TRUE)
sink("../data/generated/tree.json")
cat(myjson)
sink()




makeList<-function(x){
  if(ncol(x)>2){
    listSplit<-split(x[-1],x[1],drop=T)
    lapply(names(listSplit),function(y){list(name=y,children=makeList(listSplit[[y]]))})
  }else{
    lapply(seq(nrow(x[1])),function(y){list(name=x[,1][y],size=x[,2][y])})
  }
}


#fortree <- okcbudget %>% 
        #group_by(FundDescription,OperatingUnitDescription,ProgramName,LOBName,Account.Description) %>%
        #summarise(Total=sum(FY2015.Budget))

fortree <- read.csv("../data/generated/tree.csv")

jsonOut<-toJSON(list(name="okcbudget",children=makeList(fortree)),pretty=TRUE)
sink("../data/generated/nested_tree.json")
cat(jsonOut)
sink()








fortree <- okcbudget %>% 
        group_by(Account.Description,LOBName,ProgramName,OperatingUnitDescription,FundDescription) %>%
        summarise(Total=sum(FY2015.Budget))

write.csv(fortree,"../data/generated/inverted_tree.csv",row.names=FALSE)



myjson <- toJSON(fortree, pretty=TRUE)
sink("../data/generated/inverted_tree.json")
cat(myjson)
sink()



fortree <- read.csv("../data/generated/inverted_tree.csv")

jsonOut<-toJSON(list(name="okcbudget",children=makeList(fortree)),pretty=TRUE)
sink("../data/generated/inverted_tree.json")
cat(jsonOut)
sink()
