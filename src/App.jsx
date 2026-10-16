import React, { useState, useEffect, useRef } from 'react';

// PDT lista teljes feldolgozott adatbázisa (14 oldal, 569 tétel)
const pdtFullDatabase = [
  // 1. oldal
  { code: '100296', name: 'ACTIVE COLOR MOSÓGÉL 5,8', quantity: 12 },
  { code: '100295', name: 'ACTIVE UNIVERSAL MOSÓGÉL 5,8', quantity: 3 },
  { code: '54019', name: 'AMBI PUR FIRESIDE GLOW', quantity: 0 },
  { code: '540265', name: 'AIR WICK PURE SPRAY FAHÉJ', quantity: 16 },
  { code: '54577', name: 'AIRW. FM. SUMMER DEL.UT.', quantity: 10 },
  { code: '540415', name: 'AIRW.ACT.FR.UTÁNT.MÁLNA LIME', quantity: 10 },
  { code: '540383', name: 'AIRW.ACT.FRESH JASMINE', quantity: 9 },
  { code: '540391', name: 'AIRW.ELEKTR.UT.FRISS RUHA', quantity: 9 },
  { code: '54936', name: 'AIRW.ELEKTR.UTÁNT.MAGNÓLIA', quantity: 9 },
  { code: '540389', name: 'AIRW.FEHÉR VIRÁG EL.KÉSZ+UT.', quantity: 6 },
  { code: '540387', name: 'AIRW.FM.UTÁNT.MEDIT.NYÁR', quantity: 5 },
  { code: '54796', name: 'AIRW.ILLATGY.M.BERRY BL.', quantity: 5 },
  { code: '54800', name: 'AIRW.ILLATGY.SUG.APPLE', quantity: 5 },
  { code: '540539', name: 'AIRWICK ACT.FR.SPRAY MÁLNA', quantity: 2 },
  { code: '540413', name: 'AIRWICK ACT.FRESH UTÁNT.', quantity: 12 },
  { code: '540417', name: 'AIRWICK AUTOM.UTÁNT.MANGÓ', quantity: 6 },
  { code: '540157', name: 'AIRWICK EL.KÉSZ+UT.SZATÉN', quantity: 6 },
  { code: '540418', name: 'AIRWICK EL.KÉSZ.+UT JASMIN', quantity: 1 },
  { code: '540419', name: 'AIRWICK EL.UTÁNT.JASMINE', quantity: 14 },
  { code: '100066', name: 'AIRWICK ELEKT.UT.FEHÉR VIRÁG', quantity: 9 },
  { code: '100068', name: 'AIRWICK ELEKTR.UT.NYUG.', quantity: 9 },
  { code: '540305', name: 'AIRWICK ELEKTR.UT.NYÁRI HANG.', quantity: 18 },
  { code: '540537', name: 'AIRWICK ELEKTR.UTÁNT.BARACK', quantity: 1 },
  { code: '540416', name: 'AIRWICK FM.UT.TAVASZI SZELLŐ', quantity: 4 },
  { code: '100062', name: 'AIRWICK FM.UTÁNT.FRISS RUHA', quantity: 5 },
  { code: '540465', name: 'AIRWICK FR.UTÁNT.SÜTŐTÖK', quantity: 2 },
  { code: '100056', name: 'AIRWICK FRESH UTÁNT.JÁZMIN', quantity: 0 },
  { code: '540476', name: 'AIRWICK GYERTYA ERDEI', quantity: 1 },
  { code: '54932', name: 'AIRWICK KÉSZ+UT FRÉZIA', quantity: 3 },
  { code: '540414', name: 'AIRWICK KÉSZ+UT JÁZMIN', quantity: 2 },
  { code: '540384', name: 'AIRWICK LÉGFR.GÖMB GRAPEFR.', quantity: 2 },
  { code: '540385', name: 'AIRWICK LÉGFR.GÖMB MAGNÓLIA', quantity: 2 },
  { code: '540308', name: 'AIRWICK LÉGFR.UT.MOSOTT RUHA', quantity: 5 },
  { code: '540466', name: 'AIRWICK PÁLC.LÉGFR.TÉLI PUNCS', quantity: 2 },
  { code: '540311', name: 'AIRWICK SPRAY FRISS', quantity: 1 },
  { code: '540535', name: 'AIRWICK UTÁNT.TAVASZI SZELLŐ', quantity: 2 },
  { code: '540556', name: 'AJAX BOOST SPRAY CITROM', quantity: 12 },
  { code: '103675', name: 'AJAX FLORAL ÁLT.LEMOS.SPRING', quantity: 9 },
  { code: '540555', name: 'AJAX ÁLT.LEMOSÓ CITROM SZÓDA.', quantity: 11 },
  { code: '540294', name: 'AJAX ÁLT.LEMOSÓ SPRING FL.', quantity: 6 },
  { code: '102036', name: 'AJAX ÁLT.LEMOSÓ ULTRA FRESH', quantity: 17 },
  { code: '102037', name: 'AJAX ÁLT.LEMOSÓ ULTRA LEV.', quantity: 18 },

  // 2. oldal
  { code: '61418', name: 'ALWAYS ULT.DAY 1 NORM.', quantity: 14 },
  { code: '61419', name: 'ALWAYS ULTRA PLATINUM', quantity: 14 },
  { code: '540801', name: 'AMBI PUR COT.FR.FÜRDŐSZ.', quantity: 1 },
  { code: '540800', name: 'AMBI PUR FLOW.FÜRDŐSZ.LÉGFR.', quantity: 7 },
  { code: '540454', name: 'AMBI PUR FLOWERS SPRAY', quantity: 0 },
  { code: '540456', name: 'AMBI PUR GOLD ORCHID SPRAY', quantity: 2 },
  { code: '540481', name: 'AMBI PUR SPRAY VANILLA COOKIE', quantity: 3 },
  { code: '54961', name: 'AMBI PUR SPRING AWAK.', quantity: 1 },
  { code: '5717', name: 'AQUAFR.LITTLE TEETH FOGKEFE', quantity: 9 },
  { code: '57411', name: 'AQUAFRESH ACTIVE FRESH', quantity: 10 },
  { code: '57417', name: 'AQUAFRESH BIG TEETH FOGKR.', quantity: 6 },
  { code: '57433', name: 'AQUAFRESH FRESH MINTY', quantity: 1 },
  { code: '57356', name: 'AQUAFRESH FRESH MINTY SZÁJV.', quantity: 1 },
  { code: '57397', name: 'AQUAFRESH IN BETW.CLEAN', quantity: 2 },
  { code: '57140', name: 'AQUAFRESH LITTLE TEETH', quantity: 9 },
  { code: '101550', name: 'ARIEL 1.702L+DOMEST.PINE', quantity: 2 },
  { code: '530523', name: 'ARIEL GÉLKAPSZ.COLOR FRESH', quantity: 25 },
  { code: '530524', name: 'ARIEL GÉLKAPSZULA MSPRING', quantity: 19 },
  { code: '530521', name: 'ARIEL MOSÓGÉL COLOR 3,15L', quantity: 9 },
  { code: '530520', name: 'ARIEL MOSÓGÉL MSPRING 3,15L', quantity: 39 },
  { code: '59002', name: 'AXE AFRICA', quantity: 1 },
  { code: '58488', name: 'AXE BLACK DEO 250ML/AXE', quantity: 1 },
  { code: '103899', name: 'BABA SZAPPAN JÁZMIN 90G/BABA', quantity: 19 },
  { code: '580037', name: 'BABA TUSF.FFI MENTA 2IN1', quantity: 36 },
  { code: '103554', name: 'BABA TUSF.GRAPEFR.GYÖMBÉR', quantity: 6 },
  { code: '102910', name: 'BABA TUSF.HABCSÓK', quantity: 42 },
  { code: '580039', name: 'BABA TUSF.KAMILLA MÉZ', quantity: 48 },
  { code: '540409', name: 'BIOSTOP LÉGYFOGÓ SZALAG', quantity: 8 },
  { code: '103776', name: 'BLEND A DENT MŰFOGS.RÖGZ.', quantity: 1 },
  { code: '57437', name: 'BLEND A DENT PROT.RAGASZTÓ', quantity: 2 },
  { code: '100695', name: 'BODIE KUTYAKEKSZ VÖDRÖS 400G', quantity: 1 },
  { code: '100590', name: 'BODIE SZÍV SZÁRNYAS', quantity: 8 },
  { code: '54563', name: 'BREF CL.POW.AKT.LAVENDER', quantity: 1 },
  { code: '101607', name: 'BREF CL.POWER ACTIVE FRUITOP.', quantity: 1 },
  { code: '101608', name: 'BREF CL.POWER ACTIVE HAWAII', quantity: 2 },
  { code: '540527', name: 'BREF CLASSIC PA LE GEN Z', quantity: 4 },
  { code: '54612', name: 'BREF PREMIUM CA CHLORINE', quantity: 50 },
  { code: '54613', name: 'BREF PREMIUM CA EUCALYPT.', quantity: 64 },
  { code: '54651', name: 'BREF PREMIUM CA FR.FLOWER', quantity: 51 },
  { code: '540524', name: 'BREF PREMIUM CA LE GEN X', quantity: 8 },
  { code: '540525', name: 'BREF PREMIUM CA LE', quantity: 34 },
  { code: '540445', name: 'BREF PREMIUM CA SPA MOMENTS', quantity: 32 },

  // 3. oldal
  { code: '61227', name: 'CAREFREE ALOE TISZT.BETÉT', quantity: 25 },
  { code: '61226', name: 'CAREFREE FLEXIFORM FRESH', quantity: 9 },
  { code: '54540', name: 'CHEMOTOX CSÓTÁNY HANGY.IRT.', quantity: 6 },
  { code: '102574', name: 'CHEMOTOX ELEKTR.UTÁNT.', quantity: 1 },
  { code: '102576', name: 'CHEMOTOX HANGYA-CSÓT.', quantity: 14 },
  { code: '54538', name: 'CHEMOTOX LÉGY-SZÚNYOGIRTÓ', quantity: 12 },
  { code: '540428', name: 'CHEMOTOX POLOSKAIRTÓ', quantity: 11 },
  { code: '540452', name: 'CIF VÍZKŐOLDÓ 750ML+CIF LEM.', quantity: 2 },
  { code: '103028', name: 'COCC.BLUE 1,702L+DOMEST.PINE', quantity: 71 },
  { code: '103029', name: 'COCC.SENS.1,702L+DOMEST.PINE', quantity: 15 },
  { code: '103030', name: 'COCC.TIARE 1,61L+DOMEST.PINE', quantity: 86 },
  { code: '540372', name: 'COCC.TIARE 1,6L+DOMEST.PINE', quantity: 10 },
  { code: '103295', name: 'COCCOLINO BLUE SPL.ÖBL.', quantity: 12 },
  { code: '103294', name: 'COCCOLINO HAPPY YELL.ÖBL.', quantity: 18 },
  { code: '102469', name: 'COCCOLINO HONEYSUCKLE ÖBL.', quantity: 17 },
  { code: '102472', name: 'COCCOLINO PASSION FLOW.ÖBL.', quantity: 29 },
  { code: '103293', name: 'COCCOLINO SENS.COT.ÖBL.', quantity: 18 },
  { code: '102473', name: 'COCCOLINO TIARE FLOW.ÖBL.', quantity: 49 },
  { code: '102471', name: 'COCCOLINO WATERLILY ÖBL.', quantity: 7 },
  { code: '57245', name: 'COLG.MAX WHITE CHARCOAL', quantity: 1 },
  { code: '57263', name: 'COLG.MAX WHITE SZÁJVÍZ', quantity: 8 },
  { code: '57296', name: 'COLGATE FOGKEFE CHARCOAL', quantity: 5 },
  { code: '57420', name: 'COLGATE MAX W.PURPLE SZÁJVÍZ', quantity: 0 },
  { code: '57219', name: 'COLGATE NAT.CHARCOAL', quantity: 17 },
  { code: '57391', name: 'COLGATE SZÁJVÍZ COOL MINT', quantity: 0 },
  { code: '102038', name: 'COLGATE SZÁJVÍZ HERBAL FRESH', quantity: 1 },
  { code: '102035', name: 'COLGATE TOTAL ACTIVE FRESH', quantity: 9 },
  { code: '57308', name: 'COLGATE TOTAL CHARCOAL', quantity: 1 },
  { code: '100512', name: 'COLGATE TOTAL GUM', quantity: 1 },
  { code: '57310', name: 'COLGATE TOTAL ORIGINAL', quantity: 21 },
  { code: '57405', name: 'COLGATE TOTAL WHITENING', quantity: 19 },
  { code: '57372', name: 'COLGATE TWISTER FOGKEFE', quantity: 9 },
  { code: '56138', name: 'COLOR NAT.111 EXT.VIL.HAM.SZ/C', quantity: 5 },
  { code: '101214', name: 'COLOR NAT.112 EXT.VIL.IRR.SZŐK/', quantity: 5 },
  { code: '56140', name: 'COLOR NAT.7.4 ÉRZÉKI', quantity: 7 },
  { code: '101213', name: 'COLOR NAT.N1 ULTRAFEK.', quantity: 1 },
  { code: '101217', name: 'COLOR NAT.N9 TERM.EXTRA VIL.', quantity: 6 },
  { code: '57388', name: 'COREGA ERŐS MŰFOGS.RÖGZ.', quantity: 55 },
  { code: '57432', name: 'COREGA MŰFOGS.TISZT.TABL.', quantity: 30 },
  { code: '57389', name: 'COREGA ÍZMENT.MŰFOGS.RÖGZ.', quantity: 46 },
  { code: '65495', name: 'DARLING MARHÁS, CSIRKÉS', quantity: 6 },
  { code: '540190', name: 'DETTOL ANTIBAKT.KENDŐ ORIG.', quantity: 5 },

  // 4. oldal
  { code: '54772', name: 'DETTOL KÉSZÜLÉK+ALOE V.UT.', quantity: 1 },
  { code: '54773', name: 'DETTOL UTÁNT.MÉZ', quantity: 1 },
  { code: '540532', name: 'DOMEST.P5 WC RÚD MAGN.UNIC.', quantity: 8 },
  { code: '100639', name: 'DOMESTOS P5 WC-RÚD 6X50G', quantity: 7 },
  { code: '100640', name: 'DOMESTOS P5 WC-RÚD 6X50G', quantity: 0 },
  { code: '540502', name: 'DOMESTOS PINE 2*750ML+P5', quantity: 6 },
  { code: '5565', name: 'DOMESTOS PINE 2L/DOMESTOS', quantity: 1 },
  { code: '540421', name: 'DOMESTOS POW.FOAM ARC.FR.', quantity: 5 },
  { code: '104199', name: 'DOMESTOS POW.FOAM FLORAL', quantity: 10 },
  { code: '540345', name: 'DOMESTOS POW.FR.FLORAL', quantity: 9 },
  { code: '540817', name: 'DOMESTOS POW5 WC RÚD 3X50G', quantity: 8 },
  { code: '540506', name: 'DOMESTOS POW5 WC RÚD 3X50G', quantity: 7 },
  { code: '540818', name: 'DOMESTOS POW5 WC RÚD 3X50G', quantity: 9 },
  { code: '540816', name: 'DOMESTOS POW5 WC RÚD 3X50G', quantity: 35 },
  { code: '540505', name: 'DOMESTOS POW5 WC RÚD 3X50G', quantity: 5 },
  { code: '540346', name: 'DOMESTOS POWER FRESH LIME', quantity: 10 },
  { code: '104198', name: 'DOMESTOS WC RÚD WHITE ROSE', quantity: 5 },
  { code: '58231', name: 'DOVE INVISIBLE CARE DEO', quantity: 6 },
  { code: '580135', name: 'DOVE KRÉMTUSF.FRESH CARE', quantity: 1 },
  { code: '103728', name: 'DOVE KRÉMTUSF.FRUITY', quantity: 30 },
  { code: '58822', name: 'DOVE MEN CARE CL.COMF.DEO', quantity: 6 },
  { code: '58837', name: 'DOVE MEN CARE CLEAN COMF.', quantity: 24 },
  { code: '102280', name: 'DOVE MEN+CARE ACTIVE TUSF.', quantity: 1 },
  { code: '58868', name: 'DOVE NOURISH (DEO,TF,TESTÁP.', quantity: 3 },
  { code: '580136', name: 'DOVE ORIGINAL 150ML/DOVE', quantity: 18 },
  { code: '580137', name: 'DOVE SOFT FEEL DEO', quantity: 6 },
  { code: '65163', name: 'DREAMIES JUT.FAL.SAJT', quantity: 10 },
  { code: '65126', name: 'DREAMIES JUT.FALAT 60G', quantity: 1 },
  { code: '540523', name: 'DUCK ACT.CLEAN WC ÖBL.RÚD', quantity: 1 },
  { code: '54414', name: 'DUCK FR.STICK FENYŐ 27G/DUCK', quantity: 14 },
  { code: '54415', name: 'DUCK FR.STICK LIME 27G/DUCK', quantity: 8 },
  { code: '103998', name: 'DUCK FR.WC ÖBL.KORONG', quantity: 1 },
  { code: '104001', name: 'DUCK FR.WC ÖBL.KORONG LIME', quantity: 11 },
  { code: '104000', name: 'DUCK FR.WC ÖBL.KORONG', quantity: 12 },
  { code: '103999', name: 'DUCK FR.WC ÖBL.KORONG MINT', quantity: 9 },
  { code: '101868', name: 'DUCK FRESH DISCS UT.HIBISC.', quantity: 10 },
  { code: '101869', name: 'DUCK FRESH DISCS UT.MINT', quantity: 12 },
  { code: '540406', name: 'DUCK KORONG GARDEN ESCAPE', quantity: 1 },
  { code: '540405', name: 'DUCK KORONG TROP.ADVENTURE', quantity: 1 },
  { code: '104003', name: 'DUCK WC TISZT.GÉL HIBISCUS', quantity: 4 },
  { code: '104004', name: 'DUCK WC TISZT.GÉL MINT', quantity: 9 },
  { code: '57439', name: 'ELMEX FOGKRÉM KIDS', quantity: 6 },

  // 5. oldal
  { code: '57289', name: 'ELMEX FOGSZÚV.ELLEN DUOP.', quantity: 5 },
  { code: '57241', name: 'ELMEX SENSITIVE WHITENING', quantity: 5 },
  { code: '580045', name: 'ELSEVE SAMPON COLORVIVE', quantity: 1 },
  { code: '540240', name: 'ERDAL CIPŐ SZIVACS FEKETE', quantity: 22 },
  { code: '540241', name: 'ERDAL CIPŐ SZIVACS', quantity: 6 },
  { code: '540245', name: 'ERDAL CIPŐFÉNY BARNA', quantity: 18 },
  { code: '540246', name: 'ERDAL CIPŐFÉNY FEKETE', quantity: 29 },
  { code: '540244', name: 'ERDAL CIPŐFÉNY SZÍNTELEN', quantity: 46 },
  { code: '540243', name: 'ERDAL CIPŐKRÉM FEKETE', quantity: 25 },
  { code: '540274', name: 'ERDAL CIPŐKRÉM SZÍNTELEN', quantity: 11 },
  { code: '540238', name: 'ERDAL VELÚR NUBUK FEKETE 250', quantity: 15 },
  { code: '540239', name: 'ERDAL VELÚR NUBUK SZÍNT.', quantity: 14 },
  { code: '103991', name: 'FA KRÉMTUSF.INNO PISTACHIO', quantity: 7 },
  { code: '580123', name: 'FA MEN TUSF.ENERGYBOOST', quantity: 6 },
  { code: '58812', name: 'FA TUSF. COCONUT MILK', quantity: 2 },
  { code: '58969', name: 'FA TUSF.DIVINE MOMENTS', quantity: 10 },
  { code: '58031', name: 'FA TUSFÜRDŐ MEN SPORT', quantity: 2 },
  { code: '102848', name: 'FELIX FANT.CSIRK-PARAD.ASZP.', quantity: 6 },
  { code: '102852', name: 'FELIX FANT.DUO HALAS ASZP.', quantity: 7 },
  { code: '102850', name: 'FELIX FANT.JUNIOR ASZP.', quantity: 3 },
  { code: '65317', name: 'FELIX LAZAC,LEPÉNYHAL', quantity: 7 },
  { code: '54544', name: 'FINISH GÉPILLATOSÍTÓ CITRUS', quantity: 3 },
  { code: '54964', name: 'FINISH POWER ALLIN1 REG.TABL.', quantity: 12 },
  { code: '54993', name: 'FINISH POWER ALLIN1 TABLETTA', quantity: 17 },
  { code: '54967', name: 'FINISH QUANTUM ALLIN1', quantity: 16 },
  { code: '103551', name: 'FINISH QUANTUM FRESH', quantity: 43 },
  { code: '103550', name: 'FINISH QUANTUM LEMON', quantity: 19 },
  { code: '54992', name: 'AJAX TR.ACT.ÜVEGTISZT.500ML', quantity: 0 },
  { code: '104182', name: 'FLÓRASZEPT UNIV.FERTŐTL.', quantity: 5 },
  { code: '65384', name: 'FRISKIES LAZAC+ZÖLDSÉG 1,7', quantity: 6 },
  { code: '65377', name: 'FROLIC SMILEY STICKS', quantity: 8 },
  { code: '54838', name: 'FROSCH MÁLNAEC.VÍZKŐOLD.', quantity: 10 },
  { code: '580086', name: 'FRUCTIS VITAMIN BOX', quantity: 1 },
  { code: '58876', name: 'GARNIER PURE ACT.AHA+BHA', quantity: 1 },
  { code: '58862', name: 'GILLETTE MACH3 CHARCOAL', quantity: 1 },
  { code: '58863', name: 'GILLETTE MACH3 SPORT AJÁND.', quantity: 1 },
  { code: '540364', name: 'GLADE AEROSZOL VANILLA', quantity: 24 },
  { code: '540357', name: 'GLADE AROMATH.ILLATGY.HAPPY', quantity: 1 },
  { code: '540809', name: 'GLADE ELEKT.LÉGFR.VANÍLIA', quantity: 3 },
  { code: '540397', name: 'GLADE ELEKT.UT.WONDER', quantity: 1 },
  { code: '540337', name: 'GLADE ELEKTR.KÉSZ.WARM', quantity: 1 },
  { code: '102792', name: 'GLADE ELEKTR.LÉGFR.UT.', quantity: 1 },

  // 6. oldal
  { code: '101062', name: 'GLADE ILLATGYERTYA HONEY', quantity: 5 },
  { code: '540492', name: 'GLADE ILLATGYERTYA PUMPKIN', quantity: 14 },
  { code: '540342', name: 'GLADE ILLATGYERTYA STARLIGHT', quantity: 10 },
  { code: '540490', name: 'GLADE ILLATGYERTYA W BERRIES', quantity: 1 },
  { code: '101618', name: 'GLADE LÉGFR.ZSELÉ OCEAN ADV.', quantity: 2 },
  { code: '54559', name: 'GLADE ONE T.UT.CITRUS', quantity: 4 },
  { code: '54560', name: 'GLADE ONE T.UT.GYÖNGYV', quantity: 2 },
  { code: '540363', name: 'GLADE PURE CLEAN LINEN', quantity: 4 },
  { code: '54788', name: 'GLADE RELAXING ZEN', quantity: 2 },
  { code: '540032', name: 'GLADE SENSE KÉSZ+UTÁNT.', quantity: 3 },
  { code: '58740', name: 'GLISS BALZS.EXP.REP.TÁPL.OLAJ', quantity: 6 },
  { code: '58708', name: 'GLISS HAJREG.BALZSAM TJ.REG.', quantity: 5 },
  { code: '65203', name: 'GOLDEN CAT MACSKAKONZ.', quantity: 70 },
  { code: '65206', name: 'GOLDEN CAT MACSKAKONZ.', quantity: 72 },
  { code: '65204', name: 'GOLDEN CAT MACSKAKONZ.', quantity: 164 },
  { code: '65205', name: 'GOLDEN CAT MACSKAKONZ.', quantity: -5 },
  { code: '65474', name: 'GOURMET G. FALATOK SZÓSZBAN', quantity: 2 },
  { code: '65369', name: 'GOURMET GOLD DUÓ ÉLMÉNY', quantity: 0 },
  { code: '103012', name: 'HEAD SHOULDERS 2IN1 CITRUS', quantity: 13 },
  { code: '103011', name: 'HEAD SHOULDERS 2IN1 CLASSIC', quantity: 18 },
  { code: '580115', name: 'HEAD SHOULDERS CITRUS', quantity: 31 },
  { code: '580114', name: 'HEAD SHOULDERS CLASSIC CL.', quantity: 47 },
  { code: '58794', name: 'HELIA D CLASSIC TÁPL.HIDR.', quantity: 1 },
  { code: '65499', name: 'JACK FODT.KÁVÉFA RÁGÓBOT S', quantity: 12 },
  { code: '104216', name: 'JAR KÉZI MOSOG.LEMON LIME', quantity: 2 },
  { code: '102056', name: 'JAR LEMON 2X850ML/JAR LEMON', quantity: 32 },
  { code: '54739', name: 'JAR LEMON 2X900ML/JAR LEMON', quantity: 37 },
  { code: '102287', name: 'JAR ORIGINAL ALLIN1 LEMON', quantity: 19 },
  { code: '102049', name: 'JAR PLATINUM KAPSZ.LEMON', quantity: 26 },
  { code: '54741', name: 'JAR POMEGRANATE 2X900ML/JAR', quantity: 18 },
  { code: '102055', name: 'JAR SENS.TEA TREE MINT', quantity: 16 },
  { code: '54740', name: 'JAR SENS.TEA TREE MINT', quantity: 8 },
  { code: '59099', name: 'JOHNS.BABY BABAOLAJ ALOE V.', quantity: 12 },
  { code: '58860', name: 'JOHNSONS BABAÁPOLÓ', quantity: 5 },
  { code: '58666', name: 'JOHNSONS BEDT.BABAOLAJ', quantity: 3 },
  { code: '58664', name: 'JOHNSONS BEDTIME BABAFÜRD.', quantity: 4 },
  { code: '102563', name: 'JÓ MOSÓGÉL COLOR 4L/JÓ', quantity: 32 },
  { code: '102565', name: 'JÓ MOSÓGÉL UNIVERSAL 4L/JÓ', quantity: 16 },
  { code: '530103', name: 'K2R SZÍNFOGÓ KENDŐ 40DB/K2R', quantity: 3 },
  { code: '530021', name: 'K2R SZÍNFOGÓ ÉS FOLTETL.', quantity: 1 },
  { code: '580034', name: 'KNEIPP HABFÜRDŐ', quantity: 1 },
  { code: '104192', name: 'KOVÁSZOS VEKNI', quantity: 24 },

  // 7. oldal
  { code: '580072', name: 'LACTOVIT LACTOUREA CSOMAG', quantity: 1 },
  { code: '58841', name: 'LACTOVIT LACTOUREA TUSFÜRDŐ', quantity: 32 },
  { code: '104116', name: 'LADY SPEED STICK GÉL BR.', quantity: 7 },
  { code: '58887', name: 'LADY SPEED STICK INVISIBLE', quantity: 9 },
  { code: '58886', name: 'LADY SPEED STICK STIFT PRO SIN/', quantity: 7 },
  { code: '100240', name: 'LADY SPEED STICK ZERO ROSE', quantity: 1 },
  { code: '580077', name: 'LE PETIT M.NARANCSVIRÁG TUSF.', quantity: 3 },
  { code: '530512', name: 'LENOR DIAMOND 2X987ML', quantity: 24 },
  { code: '530513', name: 'LENOR FLORAL BOUQET 2X987ML', quantity: 23 },
  { code: '102372', name: 'LENOR FOLY.MGÉL AMETHYST 3,6', quantity: 16 },
  { code: '102370', name: 'LENOR FOLY.MGÉL APRIL FR.3,6L', quantity: 28 },
  { code: '530510', name: 'LENOR GOLD ORCHID 2X987ML', quantity: 25 },
  { code: '101142', name: 'LENOR GOLD ORCHID', quantity: 0 },
  { code: '102369', name: 'LENOR GÉLKAPSZ.AMETHYST', quantity: 14 },
  { code: '102368', name: 'LENOR GÉLKAPSZ.APRIL FRESH', quantity: 11 },
  { code: '530515', name: 'LENOR ILLATGY.ARIEL UNSTOP', quantity: 3 },
  { code: '530518', name: 'LENOR ILLATGY.UNSTOP.FRESH', quantity: 4 },
  { code: '530519', name: 'LENOR ILLATGÖNGY FLORAL B.', quantity: 10 },
  { code: '530517', name: 'LENOR ILLATGÖNGY G.ORCHID', quantity: 0 },
  { code: '530516', name: 'LENOR ILLATGÖNGY SPRING', quantity: 10 },
  { code: '102373', name: 'LENOR MOSÓPOR AMETHYST 3,6', quantity: 2 },
  { code: '100126', name: 'LENOR SENSITIVE 2X1239ML 59', quantity: 0 },
  { code: '530511', name: 'LENOR SPRING AW.2X1239ML', quantity: 120 },
  { code: '61222', name: 'LIBRESSE ULT.NORM.EÜ.BETÉT', quantity: 8 },
  { code: '61404', name: 'LIBRESSE ULTRA NIGHT', quantity: 3 },
  { code: '57095', name: 'LISTERINE STAY WHITE SZÁJVÍZ S/', quantity: 3 },
  { code: '57423', name: 'LISTERINE TOTAL CARE', quantity: 11 },
  { code: '65484', name: 'LOUISA XXL MACSKA JUTALOMF.', quantity: 0 },
  { code: '580152', name: 'MAGIC HAJTŐSZ.SPRAY SÖT.', quantity: 3 },
  { code: '58838', name: 'MEN EXPERT TUSF.PURE CARB.', quantity: 1 },
  { code: '58872', name: 'MOMENT OF CARE', quantity: 1 },
  { code: '61497', name: 'NATURELLA ULTR.BETÉT 4 NIGHT', quantity: 4 },
  { code: '61500', name: 'NATURELLA ULTRA MAXI', quantity: 1 },
  { code: '59165', name: 'NEUTROG.KÉZKR.75ML GYORS.', quantity: 14 },
  { code: '58857', name: 'NEUTROGENA KÉZ-KÖRÖMÁP.', quantity: 6 },
  { code: '58582', name: 'NEUTROGENA KÉZKR.ILLATANY-', quantity: 13 },
  { code: '58583', name: 'NEUTROGENA KÉZKR.ILLATM.', quantity: 10 },
  { code: '58859', name: 'NEUTROGENA TESTÁP.DEEP', quantity: 1 },
  { code: '61459', name: 'NICKY SUMMER SZALVÉTA 3RTG', quantity: 26 },
  { code: '61353', name: 'NICKY HALLOWEEN SZALVÉTA', quantity: 61 },
  { code: '580084', name: 'NIVEA ACTIVE PROTECTED', quantity: 2 },
  { code: '58879', name: 'NIVEA EXPRESS HYDRATION', quantity: 1 },

  // 8. oldal
  { code: '101147', name: 'NIVEA MEN DEO SPRAY DERMA C.', quantity: 2 },
  { code: '58679', name: 'NIVEA MEN SENSITIVE TUSF.', quantity: 2 },
  { code: '58699', name: 'NIVEA MICELLÁS ARCTISZT.', quantity: 2 },
  { code: '61413', name: 'OB PROCOMFORT NORMAL 64', quantity: 7 },
  { code: '61414', name: 'OB PROCOMFORT SUPER 54DB/OB', quantity: 8 },
  { code: '580092', name: 'OLD SP.ASTRONAUT', quantity: 1 },
  { code: '100411', name: 'OLD SPICE DEOSPRAY WHITEW.', quantity: 2 },
  { code: '101644', name: 'OLD SPICE LEGEND FFI TUSF.', quantity: 0 },
  { code: '100112', name: 'OLD SPICE TUSF.BEARGL/MARIO', quantity: 1 },
  { code: '580065', name: 'OLD SPICE TUSF.CAPTAIN', quantity: 0 },
  { code: '102294', name: 'OLD SPICE TUSF.COLD SPICE', quantity: 0 },
  { code: '580131', name: 'OLD SPICE TUSF.DEEP SEA', quantity: 2 },
  { code: '580130', name: 'OLD SPICE TUSF.WOLFTHORN', quantity: 0 },
  { code: '65357', name: 'ONE MINI JUNIOR CSIRKÉS', quantity: -1 },
  { code: '57232', name: 'ORAL B GUM C.MINT DEEP CL.', quantity: 1 },
  { code: '57229', name: 'ORAL B GUM GARE MINT', quantity: 1 },
  { code: '102881', name: 'ORAL B VITALITY PRO EL.', quantity: 6 },
  { code: '101483', name: 'ORAL-B IO ELEKTROMOS', quantity: 1 },
  { code: '56026', name: 'PALETTE HAJF.C1', quantity: 0 },
  { code: '56025', name: 'PALETTE HAJF.N2', quantity: 3 },
  { code: '56164', name: 'PALETTE HAJF.RFE3', quantity: 1 },
  { code: '56020', name: 'PALETTE HAJF.RI5 VÖRÖS INT.', quantity: 2 },
  { code: '56027', name: 'PALETTE ICC HAJFESTÉK N1', quantity: 1 },
  { code: '56021', name: 'PALETTE ICC HAJFESTÉK N5', quantity: 0 },
  { code: '530215', name: 'PALLOR ACTIVE 3L', quantity: 12 },
  { code: '530216', name: 'PALLOR COLOR 3L', quantity: 12 },
  { code: '530187', name: 'PALLOR XXL SZÍNVÉDŐ KENDŐ', quantity: 147 },
  { code: '58358', name: 'PALM.BL.ORCH.750ML FOLY.SZ.', quantity: 1 },
  { code: '58738', name: 'PALM.FOLY.SZAPP.HYG.FAMILY', quantity: 3 },
  { code: '58522', name: 'PALM.HYG.PLUS KONYHAI 300ML', quantity: 0 },
  { code: '58397', name: 'PALM.OLIVE M.FOLY.SZAPPAN', quantity: 1 },
  { code: '58079', name: 'PALM.OLIVE MILK TUSF.', quantity: 20 },
  { code: '58473', name: 'PALM.TF.MANDULATEJ', quantity: 7 },
  { code: '102875', name: 'PALM.TUSF.MEN REVITAL.SPORT', quantity: 1 },
  { code: '580159', name: 'PALM.TUSF.SKIN RAD.AVOCADO', quantity: 6 },
  { code: '58888', name: 'PALMOL.FOLY.SZAPP.UT.FRENCH', quantity: 3 },
  { code: '580078', name: 'PALMOLIVE ESSENCE RELAX', quantity: 1 },
  { code: '104111', name: 'PALMOLIVE F.SZAPP.UT.ITALIAN', quantity: 7 },
  { code: '58889', name: 'PALMOLIVE FOLY.SZ.UT.MOROC.', quantity: 7 },
  { code: '580028', name: 'PALMOLIVE SM.G.DINNYE TUSF.', quantity: 2 },
  { code: '102865', name: 'PALMOLIVE TUSF.DREAMY', quantity: 1 },
  { code: '100132', name: 'PALMOLIVE TUSF.FFI SPORT', quantity: 14 },

  // 9. oldal
  { code: '102873', name: 'PALMOLIVE TUSF.MEN', quantity: 4 },
  { code: '104105', name: 'PALMOLIVE TUSF.NAT.FÜGE', quantity: 12 },
  { code: '104107', name: 'PALMOLIVE TUSF.NAT.JÁZMIN', quantity: 5 },
  { code: '58827', name: 'PALMOLIVE TUSF.ORCHID', quantity: 1 },
  { code: '58828', name: 'PALMOLIVE TUSF.ROSE-PEONY', quantity: 7 },
  { code: '580053', name: 'PALMOLIVE TUSF.SPA PAMPER', quantity: 1 },
  { code: '580052', name: 'PALMOLIVE TUSF.ULTIM.RELAX', quantity: 2 },
  { code: '580041', name: 'PALMOLIVE TUSF.UT.MILK HONEY', quantity: 1 },
  { code: '580042', name: 'PALMOLIVE TUSF.UTÁNT.M.OLIVE', quantity: 1 },
  { code: '61411', name: 'PAMPERS PELENKA PREM.CARE 5', quantity: 1 },
  { code: '58647', name: 'PANTENE COND.REP.PROT', quantity: 4 },
  { code: '101145', name: 'PANTENE HYD.RECHARGE SAMP.', quantity: 3 },
  { code: '58646', name: 'PANTENE INTENS.REP.SAMP.', quantity: 2 },
  { code: '57248', name: 'PAROD.GENTLE CLEAN EXT.SOFT', quantity: 2 },
  { code: '57366', name: 'PAROD.GUMS TEETH EXTRA SOFT', quantity: 10 },
  { code: '57396', name: 'PARODONTAX FLUORID', quantity: 1 },
  { code: '57313', name: 'PARODONTAX FLUORIDE', quantity: 7 },
  { code: '57321', name: 'PARODONTAX HERBAL', quantity: 15 },
  { code: '103981', name: 'PARODONTAX HERBAL FRESH', quantity: 7 },
  { code: '57314', name: 'PARODONTAX HERBAL FRESH', quantity: 2 },
  { code: '57393', name: 'PARODONTAX WHITENING', quantity: 1 },
  { code: '57312', name: 'AQUAFRESH FAMILY FOGKRÉM', quantity: 0 },
  { code: '57253', name: 'PARODONTAX WHITENING', quantity: 2 },
  { code: '6520', name: 'PEDIGREE DEN.STIX M 7TG', quantity: 98 },
  { code: '65249', name: 'PEDIGREE DENTA ST.L 270G 7', quantity: 37 },
  { code: '65287', name: 'PEDIGREE DENTA STIX S 110G', quantity: 55 },
  { code: '65488', name: 'PEDIGREE DENTAFRESH S 110G', quantity: 15 },
  { code: '65487', name: 'PEDIGREE DENTASTIX 1080G', quantity: 3 },
  { code: '6620', name: 'PEDIGREE DENTASTIX M 180G', quantity: 33 },
  { code: '65479', name: 'PEDIGREE JUNIOR SZÁRAZ', quantity: 1 },
  { code: '65288', name: 'PEDIGREE MARKIES', quantity: 0 },
  { code: '65375', name: 'PEDIGREE RANCHOS STICKS 60G', quantity: 4 },
  { code: '540509', name: 'PENNY MOSOGATÓSZER LEMON', quantity: 43 },
  { code: '61493', name: 'PERFEX TP 48 TEK 3RTG', quantity: 1 },
  { code: '530456', name: 'PERSIL COLOR MOSÓPOR 3,3KG', quantity: 23 },
  { code: '100556', name: 'PERSIL DISCS COLOR', quantity: 5 },
  { code: '100557', name: 'PERSIL DISCS UNIVERSAL', quantity: 12 },
  { code: '530454', name: 'PERSIL GÉL COLOR 2,97L 66', quantity: 19 },
  { code: '530457', name: 'PERSIL POWER CAPS COLOR', quantity: 6 },
  { code: '530486', name: 'PERSIL POWER KAPSZ.COLOR', quantity: 2 },
  { code: '530455', name: 'PERSIL UNIVERS.GEL 2,97L 66 MO/', quantity: 38 },
  { code: '530477', name: 'PERWOLL RENEW BLACK 3L 60', quantity: 21 },

  // 10. oldal
  { code: '530478', name: 'PERWOLL RENEW BLOSSOM 3L 60', quantity: 5 },
  { code: '530479', name: 'PERWOLL RENEW COLOR 3L', quantity: 30 },
  { code: '530525', name: 'PERWOLL RENEW LIGHT COLOR', quantity: 22 },
  { code: '100666', name: 'PREV.ALUT.VEGY.STERIL', quantity: 9 },
  { code: '103504', name: 'PREVIT.ALUT.TONH-PISZTR.ZSELÉ', quantity: 0 },
  { code: '65437', name: 'PREVITAL ALUTAS.VEGYES ÍZ', quantity: 0 },
  { code: '100722', name: 'PREVITAL ALUTAS.VEGYES ÍZ', quantity: 6 },
  { code: '100665', name: 'PREVITAL MOUSSE MIX KÖLYÖK', quantity: 1 },
  { code: '540821', name: 'PROTECT HANGYAIRTÓ', quantity: 4 },
  { code: '540410', name: 'PROTECT PLUS SZÚNYOGIR.SPIR.', quantity: 1 },
  { code: '540154', name: 'PUR ALOE VERA 1200ML/PUR', quantity: 2 },
  { code: '540155', name: 'PUR RASPBERRY 1200ML/PUR', quantity: 2 },
  { code: '103152', name: 'PURINA ONE DIFF.APP.CSIR-PULY.', quantity: 0 },
  { code: '54185', name: 'RAID ELEKT UTÁNTÖLTŐ', quantity: 60 },
  { code: '54071', name: 'RAID MAX HANGYA-CSÓTÁNYIRTÓ', quantity: 11 },
  { code: '61103', name: 'REGINA HÚSVÉTI SZALVÉTA 15DB', quantity: 22 },
  { code: '61451', name: 'REGINA HÚSVÉTI SZALVÉTA 20DB', quantity: 30 },
  { code: '61012', name: 'REGINA KAR. SZALVÉTA 20DB 1', quantity: 25 },
  { code: '103045', name: 'REXONA EUCALYPTUS COCONUT', quantity: 1 },
  { code: '103051', name: 'REXONA MEN BLACK WHITE DEO', quantity: 1 },
  { code: '103053', name: 'REXONA MEN ULTRA FR.FIFA DEO', quantity: 1 },
  { code: '540378', name: 'SANYTOL FERTŐTL.MOS.ADALÉK', quantity: 13 },
  { code: '103993', name: 'SCHAUMA SAMPON 7 GYÓGYN.', quantity: 3 },
  { code: '103994', name: 'SCHAUMA SAMPON KOMLÓVAL', quantity: 6 },
  { code: '57298', name: 'SENSOD.DEEP CLEAN', quantity: 11 },
  { code: '57193', name: 'SENSOD.FLUORIDE', quantity: 12 },
  { code: '57172', name: 'SENSODYNE COOLMINT SZÁJVÍZ', quantity: 5 },
  { code: '57319', name: 'SENSODYNE DEEP CL.SOFT FOGK.', quantity: 5 },
  { code: '57277', name: 'SENSODYNE DEEP CLEAN', quantity: 6 },
  { code: '103633', name: 'SENSODYNE DEEP CLEAN', quantity: 16 },
  { code: '57413', name: 'SENSODYNE EXPERT FOGKEFE', quantity: 4 },
  { code: '100089', name: 'SENSODYNE EXTRA WHITENING', quantity: 6 },
  { code: '100090', name: 'SENSODYNE FLUORIDE', quantity: 25 },
  { code: '57414', name: 'SENSODYNE NOURISH HEAL.', quantity: 6 },
  { code: '57351', name: 'SENSODYNE REPAIR PROTECT', quantity: 2 },
  { code: '65477', name: 'SHEBA SZÁRNYAS ALUTASAK', quantity: 3 },
  { code: '540443', name: 'SIDOLUX UNIV.PADL.TISZT.', quantity: 2 },
  { code: '540326', name: 'SIDOLUX UNIV.TISZT.JAP.', quantity: 6 },
  { code: '530397', name: 'SILAN COOL FRESH 2772ML/SILAN', quantity: 19 },
  { code: '530398', name: 'SILAN FASC. JUNGLE', quantity: 30 },
  { code: '530399', name: 'SILAN FRESH SKY 2860ML/SILAN', quantity: 30 },
  { code: '530396', name: 'SILAN MAGIC MAGNOLIA', quantity: 36 },

  // 11. oldal
  { code: '530400', name: 'SILAN SENSITIVE 2860ML/SILAN', quantity: 18 },
  { code: '540407', name: 'SOMAT ALLIN1 EXTRA', quantity: 22 },
  { code: '540408', name: 'SOMAT ALLIN1 EXTRA LEMON', quantity: 15 },
  { code: '540458', name: 'SOMAT ALLIN1 EXTRA TABL.', quantity: 4 },
  { code: '54858', name: 'SOMAT LEMON OR.MOS.G.ILLAT.', quantity: 1 },
  { code: '540158', name: 'SOMAT M.GÉP TISZT.', quantity: 10 },
  { code: '540159', name: 'SOMAT MACHINE CARE', quantity: 2 },
  { code: '54859', name: 'SOMAT ÖBLÍTŐ LEMON', quantity: 36 },
  { code: '530329', name: 'SURF HAWAIIAN DREAM COCON.', quantity: 3 },
  { code: '530256', name: 'SURF MOUNT.FR.JASMINE GÉL', quantity: 4 },
  { code: '540434', name: 'SWIFFER PADLÓTAK.', quantity: 10 },
  { code: '540124', name: 'SWIFFER SZÁRAZ TÖRLŐUTÁNT.', quantity: 1 },
  { code: '540433', name: 'SWIFFER XXL KÉSZL NYÉL+2OB', quantity: 7 },
  { code: '100924', name: 'SYOSS HAJLAKK KERATIN 3IN1', quantity: 8 },
  { code: '56040', name: 'SYOSS HAJLAKK MAX HOLD 3IN1', quantity: 7 },
  { code: '100926', name: 'SYOSS HAJLAKK VOLUME 3IN1', quantity: 9 },
  { code: '101773', name: 'SYOSS LENÖV.ELFED.SPRAY', quantity: 11 },
  { code: '101774', name: 'SYOSS LENÖV.ELFED.SPRAY', quantity: 9 },
  { code: '58844', name: 'SYOSS PURE FRESH SZÁRAZSAMP.', quantity: 5 },
  { code: '58842', name: 'SYOSS SAMPON COLOR FEST.HAJ.', quantity: 1 },
  { code: '58810', name: 'SYOSS SAMPON REGENERÁLÓ', quantity: 1 },
  { code: '58845', name: 'SYOSS ZSÍROSODÁS ELLEN', quantity: 5 },
  { code: '104099', name: 'SZÁRÍTOTT MARHA BORDACSONT', quantity: 5 },
  { code: '104100', name: 'SZÁRÍTOTT SZŐRÖS NYÚLFÜL', quantity: 0 },
  { code: '56115', name: 'TAFT HAJZSELÉ POWER ACTIVITY', quantity: 2 },
  { code: '59193', name: 'TODAY APRÉS NAP.UT.TESTÁP.', quantity: 20 },
  { code: '59194', name: 'TODAY KIDS NAPOZÓ SPRAY LSF50', quantity: 7 },
  { code: '59207', name: 'TODAY KIDS NAPTEJ LSF50+', quantity: 10 },
  { code: '59263', name: 'TODAY KIDS NAPVÉDŐ SPRAY ÉRZ.', quantity: 5 },
  { code: '59208', name: 'TODAY NAPOLAISPRAY LSF20', quantity: 14 },
  { code: '59268', name: 'TODAY NAPOZÁS UTÁNI ALOE', quantity: 6 },
  { code: '59267', name: 'TODAY NAPOZÁS UTÁNI ÁPOLÓ', quantity: 3 },
  { code: '59206', name: 'TODAY NAPOZÓSPRAY LSF20', quantity: 2 },
  { code: '59191', name: 'TODAY NAPTEJ LSF30', quantity: 21 },
  { code: '59264', name: 'TODAY NAPTEJ SPF30', quantity: 6 },
  { code: '59265', name: 'TODAY NAPTEJ SPF50', quantity: 2 },
  { code: '59266', name: 'TODAY NAPVÉDŐ BALZSAM SPF', quantity: 12 },
  { code: '59255', name: 'TODAY ÁTLÁTSZÓ NAPOZÓ SPRAY', quantity: 14 },
  { code: '59262', name: 'TODAY ÁTLÁTSZÓ NAPVÉDŐ', quantity: 3 },
  { code: '101922', name: 'TOMI AMAZÓNIA 3KG 60', quantity: 19 },
  { code: '101923', name: 'TOMI COLOR 3KG 60 MOSÁS/TOMI', quantity: 21 },
  { code: '530451', name: 'TOMI COLOR GÉL 2,97L 66', quantity: 89 },

  // 12. oldal
  { code: '530489', name: 'TOMI LÓTUSZ MANDULA KAPSZ.', quantity: 12 },
  { code: '530490', name: 'TOMI ORCHIDEA MAKADÁM', quantity: 33 },
  { code: '540513', name: 'ULTRA BIO 90 FOLTETL.MOSÓKR.', quantity: 1 },
  { code: '540514', name: 'ULTRA EXT.ERŐS HIDEG ZSÍROLDÓ', quantity: 2 },
  { code: '540515', name: 'ULTRA EXTRA ERŐS', quantity: 16 },
  { code: '540112', name: 'AMBI P.3VOL COT.FL.KEZDŐCSOM.', quantity: 0 },
  { code: '54908', name: 'ULTRA FEHÉRÍTŐ 1L/ULTRA', quantity: 16 },
  { code: '540516', name: 'ULTRA FEHÉRÍTŐ CITROM', quantity: 33 },
  { code: '54203', name: 'VANISH ELŐKEZ.SPRAY PINK', quantity: 8 },
  { code: '540208', name: 'VANISH ELŐKEZELŐ SPRAY WHITE', quantity: 6 },
  { code: '53452', name: 'VANISH FEHÉR 2L/VANISH WHITE', quantity: 1 },
  { code: '103745', name: 'VANISH OXI FOLTETL.PINK', quantity: 15 },
  { code: '103744', name: 'VANISH OXI FOLTETL.WHITE', quantity: 20 },
  { code: '100459', name: 'VANISH OXI PINK FOLTT.POR', quantity: 1 },
  { code: '100460', name: 'VANISH OXI WHITE FOLTT.POR', quantity: 4 },
  { code: '540795', name: 'VAPE AFTER BITE 10ML/VAPE', quantity: 18 },
  { code: '540541', name: 'VAPE HANGYAIRTÓ CSALÉTEK', quantity: 10 },
  { code: '103136', name: 'VASELINE ALOE SOOTHE', quantity: 3 },
  { code: '103624', name: 'WELL DONE ANTARCTIC', quantity: 18 },
  { code: '103626', name: 'WELL DONE INOX TISZTÍTÓ', quantity: 21 },
  { code: '103627', name: 'WELL DONE KERÁMIA FŐZŐL.', quantity: 24 },
  { code: '103628', name: 'WELL DONE SZANITER', quantity: 29 },
  { code: '103611', name: 'WELL DONE SZŐNYEGTISZTÍTÓ', quantity: 13 },
  { code: '65361', name: 'WHISKAS ALUT.PURE DELIGHT', quantity: 7 },
  { code: '65473', name: 'WHISKAS ALUTA.PURE D.KL.ASZP.', quantity: 37 },
  { code: '104186', name: 'WHISKAS ALUTAS.HALAS-HÚSOS', quantity: 5 },
  { code: '65459', name: 'WHISKAS ALUTAS.JUNIOR', quantity: 16 },
  { code: '65452', name: 'WHISKAS ALUTAS.JUNIOR', quantity: 9 },
  { code: '65451', name: 'WHISKAS ALUTAS.MARH.CSIRKE', quantity: 8 },
  { code: '104046', name: 'WHISKAS ALUTAS.SURFTURF', quantity: 21 },
  { code: '65453', name: 'WHISKAS ALUTAS.TASTY M.', quantity: 9 },
  { code: '101500', name: 'WHISKAS LAZAC ADULT 1,4', quantity: 0 },
  { code: '101499', name: 'WHISKAS STERIL LAZAC ADULT', quantity: 2 },
  { code: '101392', name: 'WHISKAS SZÁRAZ MACSKAEL.', quantity: 2 },
  { code: '104120', name: 'WHISKAS SZÁRAZ MARHA', quantity: 4 },
  { code: '61254', name: 'WIPPY 3RTG.32TEK.LEVEND.', quantity: 3 },
  { code: '61178', name: 'WIPPY 3RÉT.32TEK.HÁRS', quantity: 21 },
  { code: '101924', name: 'WIPPY JUMBO KÉZT.2RTG 1TEK', quantity: 194 },
  { code: '103261', name: 'WOOLITE FRUITY THER.MGÉL', quantity: 21 },
  { code: '103266', name: 'WOOLITE KERATIN SÖTÉT RUH.', quantity: 14 },
  { code: '61449', name: 'ZEWA DEL.CARE 16 TEK. 3 RTG TP/', quantity: 28 },
  { code: '61001', name: 'ZEWA DEL.KAM.16 TEK. 3 RTG TP*/', quantity: 74 },

  // 13. oldal
  { code: '61356', name: 'ZEWA DEL.SPIRIT OF TEA 3RTG 90/', quantity: 33 },
  { code: '61123', name: 'ZEWA DELUXE KAM.PAPÍRZS.90DB', quantity: 86 },
  { code: '61122', name: 'ZEWA DELUXE PAPÍRSEBK.3 RTG', quantity: 115 },
  { code: '6166', name: 'ALWAYS ULT.DAY SUP.SZÁRNY.', quantity: 5 },
  { code: '58696', name: 'PALM.OLIVE SZAPP.UT.ALMOND', quantity: 10 },
  { code: '104230', name: 'WELL DONE HIDEG ZSÍROLD.XXL', quantity: 12 },
  { code: '104256', name: 'CLIN LEMON ABLAKTISZTÍTÓ', quantity: 8 },
  { code: '104270', name: 'SANYTOL FERT.UNIV.TISZT.4ACT./', quantity: 11 },
  { code: '104272', name: 'SANYTOL FERTŐT.FELÜLETT.', quantity: 12 },
  { code: '104273', name: 'SANYTOL FERT.MOS.AD.ACT.FR.', quantity: 11 },
  { code: '104274', name: 'SANYTOL FERT.FOLTETL.POR', quantity: 8 },
  { code: '530173', name: 'PALLOR 3L MOSÓGÉL MIX KARTON', quantity: 0 },
  { code: '540188', name: 'SANYTOL FERTŐTL.FELÜLETT.', quantity: 11 },
  { code: '540431', name: 'SANYTOL FERTŐTL.FOLTETL.POR', quantity: 16 },
  { code: '580024', name: 'PALMOLIVE SZAPP.UT.MILK OLIVE', quantity: 10 },
  { code: '54726', name: 'SANYTOL FERTŐTL.KONYHAI T.', quantity: 12 },
  { code: '54727', name: 'SANYTOL FERTŐTL.FÜRDŐSZ.T.', quantity: 12 },
  { code: '58695', name: 'PALMOLIVE SZAPP.UT.MILK HON.', quantity: 10 },
  { code: '58809', name: 'SYOSS BALZSAM REGENERÁLÓ', quantity: 5 },
  { code: '58843', name: 'SYOSS BALZSAM COLOR FEST.HAJ', quantity: 6 },
  { code: '61417', name: 'ALWAYS ULT.SUP. EXT.SZÁRNY', quantity: 17 },
  { code: '61420', name: 'ALWAYS ULTRA SECURE NIGHT', quantity: 12 },
  { code: '100929', name: 'SYOSS HÓVÉDŐ KERATIN', quantity: 6 },
  { code: '100930', name: 'SYOSS HÓVÉDŐ KERATIN VOLUME', quantity: 6 },
  { code: '101560', name: 'LOUISA ALUTASAKOS', quantity: 15 },
  { code: '102955', name: 'BODIE XXL DENTALSTICK MEDIUM', quantity: 8 },
  { code: '104263', name: 'SYOSS SAMPON KORP.ELLEN', quantity: 12 },
  { code: '104264', name: 'SYOSS SAMPON KERATIN', quantity: 12 },
  { code: '540293', name: 'AJAX ÁLT.LEMOSÓ RED FLOW.', quantity: 4 },
  { code: '540504', name: 'SOMAT ALL IN 1 LEMON', quantity: 6 },
  { code: '540519', name: 'PENNY FEHÉRÍTŐ LEMON 1,25', quantity: 12 },
  { code: '540520', name: 'PENNY FEHÉRÍTŐ PINE 1,25', quantity: 12 },
  { code: '65433', name: 'BODIE XXL BAROMFI HÚSCSÍKOK', quantity: 10 },
  { code: '65434', name: 'BODIE XXL MARHA HÚSCSÍKOK', quantity: 39 },
  { code: '102781', name: 'LOUISA XXL ROP.PÁRNA CSIRKE', quantity: 48 },
  { code: '102782', name: 'LOUISA XXL ROPPANÓS MIX', quantity: 32 },
  { code: '102962', name: 'LOUISA MOUSSE MACSKAEL.XXL', quantity: 8 },
  { code: '104153', name: 'BODIE SELECT CSIRKEFALATOK', quantity: 6 },
  { code: '540810', name: 'PENNY XXL WC-ILLATOSÍTÓ 3-', quantity: 33 },
  { code: '540323', name: 'AIR WICK PÁLCIKÁS LÉGFR.FORR.B.', quantity: 2 },
  { code: '540382', name: 'AIRW.ACT.FRESH EUKALIPT.FRÉZ.', quantity: 6 },
  { code: '540412', name: 'AIRWICK KÉSZ+UT.FREESIA', quantity: 3 },

  // 14. oldal
  { code: '540455', name: 'AMBI PUR OCEAN SPRAY', quantity: 1 },
  { code: '540480', name: 'AMBI PUR SPICED APPLE', quantity: 5 },
  { code: '57410', name: 'AQUAFRESH ACTIVE WHITE', quantity: 11 },
  { code: '530522', name: 'ARIEL MOSÓPOR COLOR 3,465', quantity: 14 },
  { code: '58807', name: 'AXE DARK TEMP.CSOMAG.', quantity: 6 },
  { code: '580040', name: 'BABA TUSF.LANOLIN', quantity: 48 },
  { code: '58765', name: 'BABA TUSFÜRDŐ 750ML DISPLAY', quantity: 0 },
  { code: '65382', name: 'DREAMIES JUT.FALAT CATNIP', quantity: 4 },
  { code: '540242', name: 'ERDAL CIPŐKRÉM BARNA', quantity: 15 },
  { code: '58874', name: 'GARNIER HYALUR.ALOE GEL 3IN1', quantity: 1 },
  { code: '540764', name: 'GLADE SPRING DISPLAY/GLADE', quantity: 0 },
  { code: '540808', name: 'GLADE ELEKT.LÉGFR.JAPÁNK', quantity: 1 },
  { code: '540501', name: 'GLADE ILLATGYERTYA BERRY', quantity: 2 },
  { code: '706477', name: 'GOLDF.ELDOBH.G.KESZTYŰ L', quantity: 3 },
  { code: '58856', name: 'MULTIBRAND DISPLAY', quantity: 0 },
  { code: '580104', name: 'NIVEA SOFT 200ML/NIVEA SOFT', quantity: 1 },
  { code: '58840', name: 'PANTENE REPAIR PROT.BALZSAM', quantity: 3 },
  { code: '57320', name: 'PARODONTAX ACTIVE GUM SZÁJV.', quantity: 1 },
  { code: '57371', name: 'SENSODYNE EXTRA WHITENING', quantity: 19 },
  { code: '530395', name: 'SILAN DREAMY LOTUS', quantity: 36 },
  { code: '530255', name: 'SURF TROPICAL LILY ILANG GÉL 3/', quantity: 8 },
  { code: '530450', name: 'TOMI AMAZÓNIA GÉL 2,97L 66', quantity: 22 },
  { code: '65366', name: 'WHISKAS ALUTAS.HALAS ASZP.', quantity: 1 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('products');

  const codeInputRef = useRef(null);
  const shelfNameInputRef = useRef(null);
  const categoryInputRef = useRef(null);

  // Kategóriák betöltése ABC sorrendben
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('veko_categories');
    const initial = saved ? JSON.parse(saved) : ['VEKO', 'Mosószer', 'Öblítő', 'Tisztítószer', 'Papíráru', 'Testápolás'];
    return initial.sort((a, b) => a.localeCompare(b, 'hu'));
  });
  const [newCategoryName, setNewCategoryName] = useState('');

  // Polcok / Helyek betöltése
  const [shelves, setShelves] = useState(() => {
    const saved = localStorage.getItem('veko_shelves');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'A001', category: 'Öblítő' },
      { id: 2, name: 'A002', category: 'Tisztítószer' },
    ];
  });
  const [newShelfName, setNewShelfName] = useState('');
  const [newShelfCategory, setNewShelfCategory] = useState(categories[0] || 'VEKO');

  // Termékek betöltése közvetlenül a teljes adatbázisból (nincs localStorage tárolás)
  const [products, setProducts] = useState(() => {
    return pdtFullDatabase.map((item, idx) => ({
      id: idx + 1,
      code: item.code,
      name: item.name,
      category: 'VEKO',
      locationFormat: 'VEKO/0/000',
      quantity: item.quantity,
      startDate: '',
      endDate: '',
      status: item.quantity <= 0 ? 'Elfogyott' : 'Tükrözendő'
    }));
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => { localStorage.setItem('veko_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('veko_shelves', JSON.stringify(shelves)); }, [shelves]);

  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    category: 'VEKO',
    quantity: '',
    startDate: '',
    endDate: '',
    status: 'Tükrözendő',
  });

  // Szűrési és rendezési állapotok
  const [filterCode, setFilterCode] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterQuantity, setFilterQuantity] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const formattedCat = newCategoryName.trim();
    if (categories.includes(formattedCat)) {
      alert('Ez a kategória már létezik!');
      return;
    }
    const updated = [...categories, formattedCat].sort((a, b) => a.localeCompare(b, 'hu'));
    setCategories(updated);
    setNewCategoryName('');
    if (categoryInputRef.current) categoryInputRef.current.focus();
  };

  const handleDeleteCategory = (catToDelete) => {
    if (categories.length <= 1) {
      alert('Legalább egy kategóriának maradnia kell!');
      return;
    }
    setCategories(categories.filter((c) => c !== catToDelete).sort((a, b) => a.localeCompare(b, 'hu')));
  };

  const handleAddShelf = (e) => {
    e.preventDefault();
    if (!newShelfName.trim()) return;
    const item = { id: Date.now(), name: newShelfName.trim(), category: newShelfCategory };
    setShelves([...shelves, item]);
    setNewShelfName('');
    if (shelfNameInputRef.current) shelfNameInputRef.current.focus();
  };

  const handleDeleteShelf = (id) => {
    setShelves(shelves.filter((s) => s.id !== id));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name) {
      alert('Kérjük, add meg a termék nevét!');
      return;
    }

    const qty = Number(newProduct.quantity) || 0;
    const calculatedStatus = qty <= 0 ? 'Elfogyott' : newProduct.status;

    if (editingId) {
      setProducts(
        products.map((p) => (p.id === editingId ? { ...p, ...newProduct, quantity: qty, status: calculatedStatus } : p))
      );
      setEditingId(null);
    } else {
      const itemToAdd = {
        ...newProduct,
        id: Date.now(),
        locationFormat: 'VEKO/0/000',
        quantity: qty,
        status: calculatedStatus,
      };

      setProducts([itemToAdd, ...products]);
    }

    setNewProduct({
      code: '',
      name: '',
      category: 'VEKO',
      quantity: '',
      startDate: '',
      endDate: '',
      status: 'Tükrözendő',
    });

    if (codeInputRef.current) codeInputRef.current.focus();
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setNewProduct({
      code: product.code || '',
      name: product.name || '',
      category: product.category || 'VEKO',
      quantity: product.quantity !== undefined ? product.quantity : '',
      startDate: product.startDate || '',
      endDate: product.endDate || '',
      status: product.status || 'Tükrözendő',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewProduct({ code: '', name: '', category: 'VEKO', quantity: '', startDate: '', endDate: '', status: 'Tükrözendő' });
    }
  };

  const toggleStatus = (id) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          if (Number(p.quantity) <= 0) return p;
          const nextStatus = p.status === 'Kihelyezve' ? 'Tükrözendő' : 'Kihelyezve';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleAssignLocation = (productId, newLocation) => {
    setProducts(
      products.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            locationFormat: newLocation,
            status: newLocation !== 'VEKO/0/000' ? 'Kihelyezve' : 'Tükrözendő'
          };
        }
        return p;
      })
    );
  };

  // Szűrés és rendezés
  const filteredAndSortedProducts = products
    .filter((p) => {
      const matchesCode = (p.code || '').toLowerCase().includes(filterCode.toLowerCase());
      const matchesName = (p.name || '').toLowerCase().includes(filterName.toLowerCase());
      const matchesCategory = filterCategory === '' || p.category === filterCategory;
      const matchesLocation = (p.locationFormat || '').toLowerCase().includes(filterLocation.toLowerCase());
      const matchesQuantity = filterQuantity === '' || String(p.quantity).includes(filterQuantity);
      const actionText = (p.startDate || p.endDate) ? `${p.startDate || ''} ${p.endDate || ''}` : 'nincs akció';
      const matchesAction = actionText.toLowerCase().includes(filterAction.toLowerCase());
      const matchesStatus = filterStatus === '' || p.status === filterStatus;

      return matchesCode && matchesName && matchesCategory && matchesLocation && matchesQuantity && matchesAction && matchesStatus;
    })
    .sort((a, b) => {
      let valA = '';
      let valB = '';

      if (sortBy === 'code') { valA = a.code || ''; valB = b.code || ''; }
      else if (sortBy === 'name') { valA = a.name || ''; valB = b.name || ''; }
      else if (sortBy === 'category') { valA = a.category || ''; valB = b.category || ''; }
      else if (sortBy === 'location') { valA = a.locationFormat || ''; valB = b.locationFormat || ''; }
      else if (sortBy === 'quantity') {
        const numA = Number(a.quantity) || 0;
        const numB = Number(b.quantity) || 0;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }
      else if (sortBy === 'action') { valA = a.startDate || ''; valB = b.startDate || ''; }
      else if (sortBy === 'status') { valA = a.status || ''; valB = b.status || ''; }

      const comparison = String(valA).localeCompare(String(valB), 'hu', { numeric: true });
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div style={styles.container}>
      {/* FELSŐ MENÜSOR */}
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <h1 style={styles.title}>PENNY - VEKO Asszisztens</h1>
          <span style={styles.subtitle}>Teljes PDT adatbázis ({products.length} tétel) | Kártyás Tükrözés (6 db / sor)</span>
        </div>
        <nav style={styles.nav}>
          <button style={activeTab === 'products' ? { ...styles.navBtn, ...styles.activeNavBtn } : styles.navBtn} onClick={() => setActiveTab('products')}>📦 Termékek ({products.length})</button>
          <button style={activeTab === 'shelves' ? { ...styles.navBtn, ...styles.activeNavBtn } : styles.navBtn} onClick={() => setActiveTab('shelves')}>📍 Polcok & Helyek</button>
          <button style={activeTab === 'categories' ? { ...styles.navBtn, ...styles.activeNavBtn } : styles.navBtn} onClick={() => setActiveTab('categories')}>🏷️ Kategóriák</button>
          <button style={activeTab === 'veko' ? { ...styles.navBtn, ...styles.activeNavBtn } : styles.navBtn} onClick={() => setActiveTab('veko')}>🔄 Tükrözés Tervező</button>
        </nav>
      </header>

      {/* TARTALOM */}
      <main style={styles.main}>
        
        {/* 1. POLCOK LAP */}
        {activeTab === 'shelves' && (
          <div style={styles.card}>
            <h2>📍 Polcok / Helyek Kezelése</h2>
            <form onSubmit={handleAddShelf} style={styles.inlineForm}>
              <input ref={shelfNameInputRef} type="text" placeholder="Polc neve (pl. A001)" value={newShelfName} onChange={(e) => setNewShelfName(e.target.value)} style={styles.input} />
              <select value={newShelfCategory} onChange={(e) => setNewShelfCategory(e.target.value)} style={styles.input}>
                {categories.map((cat, idx) => (<option key={idx} value={cat}>{cat}</option>))}
              </select>
              <button type="submit" style={styles.primaryBtn}>Polc Hozzáadása</button>
            </form>
            <table style={{ ...styles.table, maxWidth: '600px', marginTop: '20px' }}>
              <thead>
                <tr style={styles.tableHeader}><th style={styles.th}>Polc Neve</th><th style={styles.th}>Kategória</th><th style={styles.th}>Művelet</th></tr>
              </thead>
              <tbody>
                {shelves.length === 0 ? (<tr><td colSpan="3" style={{ textAlign: 'center', padding: '15px' }}>Nincs rögzített polc.</td></tr>) : (
                  shelves.map((s) => (
                    <tr key={s.id} style={styles.tableRow}>
                      <td style={styles.td}><strong>{s.name}</strong></td>
                      <td style={styles.td}>{s.category}</td>
                      <td style={styles.td}><button onClick={() => handleDeleteShelf(s.id)} style={styles.deleteBtn}>Törlés</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. KATEGÓRIÁK LAP */}
        {activeTab === 'categories' && (
          <div style={styles.card}>
            <h2>🏷️ Kategóriák Kezelése (Automatikus ABC sorrend)</h2>
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', marginTop: '15px', maxWidth: '400px' }}>
              <input ref={categoryInputRef} type="text" placeholder="Új kategória neve" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} style={styles.input} />
              <button type="submit" style={styles.primaryBtn}>Hozzáadás</button>
            </form>
            <ul style={{ marginTop: '20px', paddingLeft: '20px' }}>
              {categories.map((cat, index) => (
                <li key={index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', maxWidth: '400px', alignItems: 'center', background: '#f9f9f9', padding: '6px 10px', borderRadius: '4px' }}>
                  <span><strong>{index + 1}.</strong> {cat}</span>
                  <button onClick={() => handleDeleteCategory(cat)} style={styles.deleteBtn}>Törlés</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. TERMÉKEK TAB */}
        {activeTab === 'products' && (
          <div>
            <h2>Vegyi Inout Termékek ({products.length} db)</h2>

            <div style={{ ...styles.card, border: editingId ? '2px solid #ed6c02' : '1px solid #ddd' }}>
              <h3>{editingId ? '✏️ Termék Módosítása' : '➕ Új VEKO termék rögzítése'}</h3>
              <form onSubmit={handleAddProduct} style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Cikkszám:</label>
                  <input ref={codeInputRef} type="text" value={newProduct.code} onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })} placeholder="pl. 100296" style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Termék neve:</label>
                  <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="pl. ACTIVE COLOR MOSÓGÉL 5,8" style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Kategória:</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} style={styles.input}>
                    {categories.map((cat, idx) => (<option key={idx} value={cat}>{cat}</option>))}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Mennyiség (db):</label>
                  <input type="number" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} placeholder="pl. 12 (0 = elfogyott)" style={styles.input} />
                </div>
                <div style={{ gridColumn: '1 / -1', background: '#fff8f8', padding: '12px', borderRadius: '6px', border: '1px solid #ffcccc' }}>
                  <label style={{ ...styles.label, color: '#cc0000', marginBottom: '8px' }}>⏰ Akciós időszak (-tól -ig):</label>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div>
                      <span style={styles.subLabel}>Kezdő dátum (-tól):</span>
                      <input type="date" value={newProduct.startDate} onChange={(e) => setNewProduct({ ...newProduct, startDate: e.target.value })} style={styles.input} />
                    </div>
                    <div>
                      <span style={styles.subLabel}>Záró dátum (-ig):</span>
                      <input type="date" value={newProduct.endDate} onChange={(e) => setNewProduct({ ...newProduct, endDate: e.target.value })} style={styles.input} />
                    </div>
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: '5px', display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ ...styles.primaryBtn, backgroundColor: editingId ? '#ed6c02' : '#cc0000' }}>
                    {editingId ? 'Módosítás mentése' : 'Termék rögzítése (Alaphely: VEKO/0/000)'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setNewProduct({ code: '', name: '', category: 'VEKO', quantity: '', startDate: '', endDate: '', status: 'Tükrözendő' }); }} style={styles.secondaryBtn}>Mégse</button>
                  )}
                </div>
              </form>
            </div>

            {/* Szűrés & Rendezés */}
            <div style={styles.card}>
              <h3>🔍 Szűrési és Rendezési Feltételek</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '10px' }}>
                <div>
                  <label style={styles.subLabel}>Rendezés alapja:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.input}>
                    <option value="code">Cikkszám</option>
                    <option value="name">Név</option>
                    <option value="category">Kategória</option>
                    <option value="location">Polchely</option>
                    <option value="quantity">Mennyiség</option>
                    <option value="action">Akció</option>
                    <option value="status">Státusz</option>
                  </select>
                </div>
                <div>
                  <label style={styles.subLabel}>Rendezési irány:</label>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={styles.input}>
                    <option value="asc">Növekvő (A-Z / 0-9)</option>
                    <option value="desc">Csökkenő (Z-A / 9-0)</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Oszlop szerinti szűrés:</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginTop: '8px' }}>
                  <input type="text" placeholder="Szűrés cikkszámra..." value={filterCode} onChange={(e) => setFilterCode(e.target.value)} style={styles.smallInput} />
                  <input type="text" placeholder="Szűrés névre..." value={filterName} onChange={(e) => setFilterName(e.target.value)} style={styles.smallInput} />
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={styles.smallInput}>
                    <option value="">Minden kategória</option>
                    {categories.map((c, idx) => (<option key={idx} value={c}>{c}</option>))}
                  </select>
                  <input type="text" placeholder="Szűrés polchelyre..." value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} style={styles.smallInput} />
                  <input type="text" placeholder="Szűrés mennyiségre..." value={filterQuantity} onChange={(e) => setFilterQuantity(e.target.value)} style={styles.smallInput} />
                  <input type="text" placeholder="Szűrés akcióra..." value={filterAction} onChange={(e) => setFilterAction(e.target.value)} style={styles.smallInput} />
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.smallInput}>
                    <option value="">Minden státusz</option>
                    <option value="Tükrözendő">Tükrözendő</option>
                    <option value="Kihelyezve">Kihelyezve</option>
                    <option value="Elfogyott">Elfogyott</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Termék Táblázat */}
            <div style={styles.card}>
              <h3>📋 Rögzített Termékek ({filteredAndSortedProducts.length} db találat)</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>Cikkszám</th>
                      <th style={styles.th}>Név</th>
                      <th style={styles.th}>Kategória</th>
                      <th style={styles.th}>Polchely</th>
                      <th style={styles.th}>Raktár Menny.</th>
                      <th style={styles.th}>Akció</th>
                      <th style={styles.th}>Státusz</th>
                      <th style={styles.th}>Műveletek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedProducts.length === 0 ? (
                      <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Nincs a szűrésnek megfelelő találat.</td></tr>
                    ) : (
                      filteredAndSortedProducts.map((p) => {
                        const isExpired = p.endDate && p.endDate < todayStr;
                        const isOutOfStock = Number(p.quantity) <= 0;
                        return (
                          <tr key={p.id} style={styles.tableRow}>
                            <td style={styles.td}><code>{p.code || '-'}</code></td>
                            <td style={styles.td}><strong>{p.name}</strong></td>
                            <td style={styles.td}>{p.category}</td>
                            <td style={styles.td}>
                              <code style={{ background: p.locationFormat === 'VEKO/0/000' ? '#fff3e0' : '#e8f5e9', padding: '3px 6px', borderRadius: '4px' }}>
                                {p.locationFormat}
                              </code>
                            </td>
                            <td style={styles.td}><strong>{p.quantity} db</strong></td>
                            <td style={styles.td}>
                              {!p.startDate && !p.endDate ? (
                                <span style={{ color: '#888', fontSize: '12px' }}>Nincs akcióban</span>
                              ) : isExpired ? (
                                <span style={{ color: '#999', fontSize: '12px', fontStyle: 'italic' }}>Lejárt akció</span>
                              ) : (
                                <span style={{ fontSize: '12px', background: '#ffebee', padding: '3px 6px', borderRadius: '4px', color: '#c62828' }}>
                                  {p.startDate} ➔ {p.endDate}
                                </span>
                              )}
                            </td>
                            <td style={styles.td}>
                              <span onClick={() => toggleStatus(p.id)} style={{ ...styles.badge, backgroundColor: isOutOfStock ? '#757575' : p.status === 'Kihelyezve' ? '#2e7d32' : '#ed6c02', cursor: isOutOfStock ? 'default' : 'pointer' }}>
                                {isOutOfStock ? 'Elfogyott ⚠️' : `${p.status} 🔄`}
                              </span>
                            </td>
                            <td style={styles.td}>
                              <div style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => handleEditClick(p)} style={styles.editBtn}>Szerkesztés</button>
                                <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>Törlés</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. TÜKRÖZÉS TERVEZŐ LAP (6 kártya egymás mellett) */}
        {activeTab === 'veko' && (
          <div style={styles.card}>
            <h2>🔄 VEKO Tükrözés & Kártyás Vizualizáció</h2>
            <p>Itt láthatod a termékeket kártyákon (pontosan <strong>6 kártya / sor</strong>). Ha átállítod a polcot, a helye frissül.</p>
            
            <div style={styles.cardGrid}>
              {products.map((p) => {
                const isAssigned = p.locationFormat && p.locationFormat !== 'VEKO/0/000';
                return (
                  <div key={p.id} style={{ ...styles.productCard, borderColor: isAssigned ? '#2e7d32' : '#ed6c02' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', background: '#eee', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                        {p.code || 'Nincs kód'}
                      </span>
                      <span style={{ fontSize: '11px', color: Number(p.quantity) <= 0 ? '#d32f2f' : '#2e7d32', fontWeight: 'bold' }}>
                        {p.quantity} db
                      </span>
                    </div>
                    
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', lineHeight: '1.2' }} title={p.name}>
                      {p.name}
                    </h4>
                    
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                      🏷️ {p.category}
                    </div>

                    <div style={{ background: isAssigned ? '#e8f5e9' : '#fff3e0', padding: '6px', borderRadius: '4px', fontSize: '12px', marginBottom: '10px', textAlign: 'center' }}>
                      Hely: <strong>{p.locationFormat}</strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <select
                        value={p.locationFormat}
                        onChange={(e) => handleAssignLocation(p.id, e.target.value)}
                        style={{ fontSize: '11px', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                      >
                        <option value="VEKO/0/000">VEKO/0/000 (Alap)</option>
                        {shelves.map(s => (
                          <option key={s.id} value={`${s.name}/1/052`}>{s.name} polc</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', margin: 0, padding: 0 },
  header: { backgroundColor: '#cc0000', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', flexWrap: 'wrap', gap: '10px' },
  logoArea: { display: 'flex', flexDirection: 'column' },
  title: { margin: 0, fontSize: '22px' },
  subtitle: { fontSize: '12px', opacity: 0.9 },
  nav: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  navBtn: { backgroundColor: 'transparent', border: 'none', color: '#fff', padding: '10px 14px', fontSize: '14px', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' },
  activeNavBtn: { backgroundColor: 'rgba(255, 255, 255, 0.25)', fontWeight: 'bold' },
  main: { padding: '20px 30px', maxWidth: '1400px', margin: '0 auto' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginTop: '15px' },
  inlineForm: { display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap', maxWidth: '600px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: '#333' },
  subLabel: { display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px', color: '#555' },
  input: { width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' },
  smallInput: { width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '12px' },
  primaryBtn: { color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  secondaryBtn: { backgroundColor: '#757575', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
  tableHeader: { backgroundColor: '#f0f0f0', textAlign: 'left' },
  th: { padding: '12px 10px', borderBottom: '2px solid #ddd', fontSize: '13px' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '10px', fontSize: '13px', verticalAlign: 'middle' },
  badge: { color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', display: 'inline-block' },
  editBtn: { backgroundColor: '#1976d2', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' },
  deleteBtn: { backgroundColor: '#d32f2f', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
    gap: '12px',
    marginTop: '15px'
  },
  productCard: {
    backgroundColor: '#fff',
    border: '2px solid #ddd',
    borderRadius: '6px',
    padding: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
};
