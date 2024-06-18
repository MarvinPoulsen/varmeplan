
MODULE VARMEPLAN
--------------------
Varmeplans dashboard

DEPRECATION
--------------------
Deprecates: none         
Deprecated by: none

DOCUMENTATION
--------------------
No external documentation

INSTALLATION
--------------------

1: Installation  
1a: Add the following line to the modules file:

      <module name="varmeplan" dir="standard/varmeplan" permissionlevel="public" />

2: ... step 2 ...

PARAMETERS
--------------------
Hvis denne parameter er sat tvinges alle charts til at vise data for parametrene, selv om de ikke findes i data.
    <param name="module.varmeplan.force.analysisparams">Fjernvarme/blokvarme,Varmepumpe,Elvarme,Biobrændsel,Olie,Andet</param>

Hvis denne parameter er sat, vil minimappet zoome til mapextent on default
    <param name="module.varmeplan.force.mapextent">true</param>


LIMITATIONS
--------------------
None

DEPENDENCIES
--------------------
None

CHANGES
--------------------
```
Date           Version        Ini            Description 
2024-03-22     1.0.0          MARPO          Varmeplans Modul oprettet  
```