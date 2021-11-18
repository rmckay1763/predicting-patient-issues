from datetime import datetime
import typing
from pydantic import BaseModel
from typing import List, Optional

class AdmissionDrug(BaseModel):
    admissiondrugid: int
    patientunitstayid: int
    drugoffset: int
    drugenteredoffset: int
    drugnotetype: Optional[str] = ""
    specialtytype: Optional[str] = ""
    usertype: str
    rxincluded: Optional[str] = ""
    writtenineicu: Optional[str] = ""
    drugname: str
    drugdosage: Optional[float] = 0.0
    drugunit: Optional[str] = ""
    drugadmitfrequency: str
    drughiclseqno: Optional[int] = 0

class AdmissionDX(BaseModel):
    admissiondxid: int
    patientunitstayid: int
    admitdxenteredoffset: int
    admitdxpath: str
    admitdxname: Optional[str] = ""
    admitdxtext: Optional[str] = ""

class Allergy(BaseModel):
    allergyid: int
    patientunitstayid: int
    allergyoffset: int
    allergyenteredoffset: int
    allergynotetype: Optional[str] = ""
    specialtytype: Optional[str] = ""
    usertype: str
    rxincluded: Optional[str] = ""
    writtenineicu: Optional[str] = ""
    drugname: str
    allergytype: Optional[str] = ""
    allergyname: Optional[str] = ""
    drughiclseqno: Optional[int] = 0    

class Diagnosis(BaseModel):
    diagnosisid: int
    patientunitstayid: int
    activeupondischarge: Optional[str] = ""
    diagnosisoffset: int
    diagnosisstring: str
    icd9code: Optional[str] = ""
    diagnosispriority: str

class InfusionDrug(BaseModel):
    infusiondrugid: int
    patientunitstayid: int
    infusionoffset: int
    drugname: str
    drugrate: Optional[str] = ""
    infusionrate: Optional[str] = ""
    drugamount: Optional[str] = ""
    volumeoffluid: Optional[str] = ""
    patientweight: Optional[str] = ""

class NurseAssessment(BaseModel):
    nurseassessid: int
    patientunitstayid: int
    nurseassessoffset: int
    nurseassessentryoffset: int
    cellattributepath: str
    celllabel: str
    cellattribute: str
    cellattributevalue: Optional[str] = ""

class NurseCharting(BaseModel):
    nursingchartid: int
    patientunitstayid: int
    nursingchartoffset: int
    nursingchartentryoffset: int
    nursingchartcelltypecat: str
    nursingchartcelltypevallabel: Optional[str] = ""
    nursingchartcelltypevalname: Optional[str] = ""
    nursingchartvalue: Optional[str] = ""

class PastHistory(BaseModel):
    pasthistoryid: int
    patientunitstayid: int
    pasthistoryoffset: int
    pasthistoryenteredoffset: int
    pasthistorynotetype: Optional[str] = ""
    pasthistorypath: str
    pasthistoryvalue: Optional[str] = ""
    pasthistoryvaluetext: Optional[str] = ""

class Patient(BaseModel):
    patientunitstayid: int
    patienthealthsystemstayid: Optional[int]
    gender: Optional[str] = ""
    age: Optional[str] = ""
    ethnicity: Optional[str] = ""
    hospitalid: Optional[int]
    wardid: Optional[int]
    apacheadmissiondx: Optional[str] = ""
    admissionheight: Optional[float]
    hospitaladmittime24: Optional[str] = ""
    hospitaladmitoffset: Optional[int]
    hospitaladmitsource: Optional[str] = ""
    hospitaldischargeyear: int 
    hospitaldischargetime24: Optional[str] = ""
    hospitaldischargeoffset: Optional[int]
    hospitaldischargelocation: Optional[str] = ""
    hospitaldischargestatus: Optional[str] = ""
    unittype: Optional[str] = ""
    unitadmittime24: Optional[str] = ""
    unitadmitsource: Optional[str] = ""
    unitvisitnumber: Optional[int]
    unitstaytype: Optional[str] = ""
    admissionweight: Optional[float]
    dischargeweight: Optional[float]
    unitdischargetime24: Optional[str] = ""
    unitdischargeoffset: Optional[int]
    unitdischargelocation: Optional[str] = ""
    unitdischargestatus: Optional[str] = ""
    uniquepid: Optional[str] = ""

class Treatment(BaseModel):
    treatmentid: int
    patientunitstayid: Optional[int]
    treatmentoffset: Optional[int]
    treatmentstring: Optional[str] = ""
    activeupondischarge: Optional[str] = ""

class VitalAperiodic(BaseModel):
    vitalaperiodicid: int
    patientunitstayid: int
    observationoffset: int
    noninvasivesystolic: Optional[float]
    noninvasivediastolic: Optional[float]
    noninvasivemean: Optional[float]
    paop: Optional[float]
    cardiacoutput: Optional[float]
    cardiacinput: Optional[float]
    svr: Optional[float]
    svri: Optional[float]
    pvr: Optional[float]
    pvri: Optional[float]

class VitalPeriodic(BaseModel):
    vitalperiodicid: int
    patientunitstayid: Optional[int]
    observationoffset: Optional[int]
    temperature: Optional[float]
    sao2: Optional[int]
    heartrate: Optional[int]
    respiration: Optional[int]
    cvp: Optional[int]
    etco2: Optional[int]
    systemicsystolic: Optional[int]
    systemicdiastolic: Optional[int]
    systemicmean: Optional[int]
    pasystolic: Optional[int]
    padiastolic: Optional[int]
    pamean: Optional[int]
    st1: Optional[float]
    st2: Optional[float]
    st3: Optional[float]
    icp: Optional[int]

class Users(BaseModel):
    uid: int
    firstname: str
    lastname: str
    username: str
    rank: Optional[str] = ""
    role: Optional[int] = 0

class UsersIn(BaseModel):
    firstname: str
    lastname: str
    username: str
    rank: Optional[str] = ""
    role: Optional[int] = 0
