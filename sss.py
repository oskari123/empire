t1=input("Anna tuote: ")
ed=t1
t2=input("Anna tuote: ")
if(t1==t2):
    print("Kauppalista:")
    print(t1)
else:
    t3=input("Anna tuote: ")
    if(t2==t3):
        print("Kauppalista:")
        print(t1+" ja "+t2)
    else:
        t4=input("Anna tuote: ")
        if(t4==t3):
            print("Kauppalista:")
            print(t1+" ja "+t2+" ja "+t3)
        else:
            t5=input("Anna tuote: ")
            if(t4==t5):
                print("Kauppalista:")
                print(t1+" ja "+t2+" ja "+t3+" ja "+t4)
            else:
                t6=input("Anna tuote: ")
                if(t6==t5):
                    print("Kauppalista:")
                    print(t1+" ja "+t2+" ja "+t3+" ja "+t4+" ja "+t5)
                else:
                    t7=input("Anna tuote: ")
                    if(t6==t7):
                        print("Kauppalista:")
                        print(t1+" ja "+t2+" ja "+t3+" ja "+t4+" ja "+t5+" ja "+t6)
                    else:
                        t8=input("Anna tuote: ")
                        if(t8==t7):
                            print("Kauppalista:")
                            print(t1+" ja "+t2+" ja "+t3+" ja "+t4+" ja "+t5+" ja "+t6+" ja "+t7)
                        else:
                            t9=input("Anna tuote: ")
                            if(t8==t9):
                                print("Kauppalista:")
                                print(t1+" ja "+t2+" ja "+t3+" ja "+t4+" ja "+t5+" ja "+t6+" ja "+t7+" ja "+t8)
                            else:
                                t10=input("Anna tuote: ")
                                if(t10==t9):
                                    print("Kauppalista:")
                                    print(t1+" ja "+t2+" ja "+t3+" ja "+t4+" ja "+t5+" ja "+t6+" ja "+t7+" ja "+t8+" ja "+t9)
                                else:
                                    print("yli")