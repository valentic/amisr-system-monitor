#!/usr/bin/env python

import bz2
import json

import xml.etree.ElementTree as ET
from . import aeustatus

def parse_xmlbz(entry):

    contents = bz2.decompress(entry["xmlbz"])
    tree = ET.ElementTree(ET.fromstring(contents))
    root = tree.getroot()
    power = root.find(".//power")

    results = {}
    metadata = {
        "timestamp": root.get("timestamp"),
        "face": root.get("face"),
        "device_id": entry["device_id"]
    }
    summary = {
        "good": int(power.get("good")),
        "bad": int(power.get("bad")),
        "ugly": int(power.get("ugly")), 
        "total": int(power.get("total")), 
        "peak_power": float(power.get("peak")), 
        "rf_enabled": bool(int(power.get("rf")))
    }
    results = {
        "metadata": metadata,
        "summary": summary,
    }

    panels = {} 

    for panel in root.findall(".//panel"):
        aeus = {}

        for aeu in panel.findall("aeu"):
            row = {}
            
            try:
                status = aeustatus.AEUStatus(aeu.text)
            except:
                status = None

            if status:
               row["pfwd"] = round(status.pfwd,1)
               row["pref"] = round(status.pref,1)
               row["p5v"] = round(status.p5v_voltage_monitor,1)
               row["p8v"] = round(status.p8v_voltage_monitor,1)
               row["m8v"] = round(status.m8v_voltage_monitor,1)
               row["sspa_voltage"] = round(status.sspa_voltage_monitor,1)
               row["sspa_current"] = round(status.sspa_current_monitor,1)
               row["controller_temp"] = round(status.controller_temp,1)
               row["sspa_temp"] = round(status.sspa_temp,1)

            row["pwatts"] = float(aeu.get("pwatts"))

            position = int(aeu.get("position"))
            aeus[position] = row

        panel_name = panel.get("id")
        panels[panel_name] = aeus 

    results["panels"] = panels

    return results

def parse(rows):

    results = {}

    for row in rows:
        device_id = row["device_id"]
        results[device_id] = parse_xmlbz(row)

    return results

