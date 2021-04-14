import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/screens/squirm/squirm_screen.dart';
import 'package:healthcare_app/utils/http_client.dart';
import 'package:page_transition/page_transition.dart';

class Body extends StatefulWidget {
  Body({Key key}) : super(key: key);
  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  Future<dynamic> fetchHealth() async {
    Future.delayed(Duration(seconds: 5));
    final response = await HttpClient.getWithoutDecode(path: '/health');
    return json.decode(response);
  }

  bool _isEnable = false;
  String _height = '-';
  String _weight = '-';
  String _bloodType = '-';
  String _systolic = '-';
  String _diastolic = '-';
  String _hearthRate = '-';
  String _temperature = '-';
  String _bmi = '-';
  TextEditingController _heightController = TextEditingController();
  TextEditingController _weightController = TextEditingController();
  TextEditingController _bloodTypeController = TextEditingController();
  TextEditingController _pressureController = TextEditingController();
  TextEditingController _hearthRateController = TextEditingController();
  TextEditingController _temperatureController = TextEditingController();
  TextEditingController _bmiController = TextEditingController();
  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  updateHealth() async {
    final response = await HttpClient.put('/health', {
      "height": _heightController.text,
      "weight": _weightController.text,
      "bloodType": _bloodTypeController.text,
      "systolic": _pressureController.text.split('/')[0],
      "diastolic": _pressureController.text.split('/')[1],
      "hearthRate": _hearthRateController.text,
      "temperature": _temperatureController.text,
    });
    if (response.containsKey("statusCode") && response["statusCode"] != 200) {
      return showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: Text('Error'),
              content: Text(response["message"]),
            );
          });
    } else {
      return showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              content: Text('อัพเดทข้อมูลเรียบร้อย'),
            );
          });
    }
    // }
  }

  updateEnable() async {
    _isEnable ? _isEnable = false : _isEnable = true;
  }

  setHealthColor(type, value) {
    if (type == "bmi") {
      if (double.parse(value) > 30) {
        return Colors.red;
      } else if (double.parse(value) < 18.5 || double.parse(value) > 23) {
        return Colors.yellow;
      } else {
        return Colors.green;
      }
    } else if (type == "pressure") {
      var pressure = value.split("/");
      if (double.parse(pressure[0]) < 90 ||
          double.parse(pressure[1]) < 60 ||
          double.parse(pressure[0]) > 160 ||
          double.parse(pressure[1]) > 100) {
        return Colors.red;
      } else if (double.parse(pressure[0]) < 110 ||
          double.parse(pressure[1]) < 70 ||
          double.parse(pressure[0]) > 140 ||
          double.parse(pressure[1]) > 90) {
        return Colors.yellow;
      } else {
        return Colors.green;
      }
    } else if (type == "heartRate") {
      if (double.parse(value) < 60 || double.parse(value) > 100) {
        return Colors.red;
      } else {
        return Colors.green;
      }
    } else if (type == "temperature") {
      if (double.parse(value) < 35 || double.parse(value) > 38.5) {
        return Colors.red;
      } else if (double.parse(value) < 36.1 || double.parse(value) > 37.2) {
        return Colors.yellow;
      } else {
        return Colors.green;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      if (state.user != null) {
        return Column(
          children: [
            Container(
                margin: EdgeInsets.all(20),
                padding: EdgeInsets.all(20),
                child: FutureBuilder<dynamic>(
                    future: fetchHealth(),
                    builder: (BuildContext context, AsyncSnapshot snapshot) {
                      if (snapshot.hasData) {
                        final hData = snapshot.data;
                        hData['height'] == null
                            ? _height = '-'
                            : _height = hData['height'].toString();
                        hData['weight'] == null
                            ? _weight = '-'
                            : _weight = hData['weight'].toString();
                        hData['bloodType'] == null
                            ? _bloodType = '-'
                            : _bloodType = hData['bloodType'].toString();
                        hData['systolic'] == null
                            ? _systolic = '-'
                            : _systolic = hData['systolic'].toString();
                        hData['diastolic'] == null
                            ? _diastolic = '-'
                            : _diastolic = hData['diastolic'].toString();
                        hData['hearthRate'] == null
                            ? _hearthRate = '-'
                            : _hearthRate = hData['hearthRate'].toString();
                        hData['temperature'] == null
                            ? _temperature = '-'
                            : _temperature = hData['temperature'].toString();
                        hData['BMI'] == null
                            ? _bmi = '-'
                            : _bmi = hData['BMI'].toStringAsFixed(2);
                        _heightController.text = _height;
                        _weightController.text = _weight;
                        _bloodTypeController.text = _bloodType;
                        _pressureController.text = "$_systolic/$_diastolic";
                        _hearthRateController.text = _hearthRate;
                        _temperatureController.text = _temperature;
                        _bmiController.text = _bmi;
                        return Column(children: [
                          Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(
                                    flex: 9,
                                    child: Column(children: [
                                      Table(
                                        columnWidths: {
                                          0: FlexColumnWidth(5),
                                          1: FlexColumnWidth(3),
                                        },
                                        children: [
                                          TableRow(children: [
                                            Container(
                                                padding: EdgeInsets.fromLTRB(
                                                    0, 10, 0, 0),
                                                child: Text(
                                                  'ส่วนสูง (ซม.)',
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 18,
                                                  ),
                                                )),
                                            TextField(
                                              controller: _heightController,
                                              enabled: _isEnable,
                                              textAlign: TextAlign.center,
                                              inputFormatters: <
                                                  TextInputFormatter>[
                                                FilteringTextInputFormatter
                                                    .allow(RegExp(r'^[0-9.]+$'))
                                              ],
                                              decoration: InputDecoration(
                                                  contentPadding:
                                                      EdgeInsets.all(5),
                                                  focusedBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  enabledBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  border: InputBorder.none,
                                                  hintText: 'ส่วนสูง'),
                                            ),
                                          ]),
                                          rowSpacer,
                                          TableRow(children: [
                                            Container(
                                                padding: EdgeInsets.fromLTRB(
                                                    0, 10, 0, 0),
                                                child: Text(
                                                  'น้ำหนัก (กก.)',
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 18,
                                                  ),
                                                )),
                                            TextField(
                                              controller: _weightController,
                                              enabled: _isEnable,
                                              textAlign: TextAlign.center,
                                              inputFormatters: <
                                                  TextInputFormatter>[
                                                FilteringTextInputFormatter
                                                    .allow(RegExp(r'^[0-9.]+$'))
                                              ],
                                              decoration: InputDecoration(
                                                  contentPadding:
                                                      EdgeInsets.all(5),
                                                  focusedBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  enabledBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  border: InputBorder.none,
                                                  hintText: 'น้ำหนัก'),
                                            ),
                                          ]),
                                          rowSpacer,
                                          TableRow(children: [
                                            Container(
                                                padding: EdgeInsets.fromLTRB(
                                                    0, 10, 0, 0),
                                                child: Text(
                                                  'ค่าดัชนีมวลกาย',
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 18,
                                                  ),
                                                )),
                                            TextField(
                                              controller: _bmiController,
                                              enabled: false,
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                  color: setHealthColor("bmi",
                                                      _bmiController.text)),
                                              decoration: InputDecoration(
                                                  contentPadding:
                                                      EdgeInsets.all(5),
                                                  focusedBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  enabledBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  border: InputBorder.none),
                                            ),
                                          ]),
                                          rowSpacer,
                                          TableRow(children: [
                                            Container(
                                                padding: EdgeInsets.fromLTRB(
                                                    0, 10, 0, 0),
                                                child: Text(
                                                  'กรุ๊ปเลือด',
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 18,
                                                  ),
                                                )),
                                            TextField(
                                              controller: _bloodTypeController,
                                              enabled: _isEnable,
                                              textAlign: TextAlign.center,
                                              decoration: InputDecoration(
                                                  contentPadding:
                                                      EdgeInsets.all(5),
                                                  focusedBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  enabledBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  border: InputBorder.none,
                                                  hintText: 'กรุ๊ปเลือด'),
                                            ),
                                          ]),
                                          rowSpacer,
                                          TableRow(children: [
                                            Container(
                                                padding: EdgeInsets.fromLTRB(
                                                    0, 10, 0, 0),
                                                child: Text(
                                                  'ความดัน',
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 18,
                                                  ),
                                                )),
                                            TextField(
                                              controller: _pressureController,
                                              enabled: _isEnable,
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                  color: setHealthColor(
                                                      "pressure",
                                                      _pressureController
                                                          .text)),
                                              inputFormatters: <
                                                  TextInputFormatter>[
                                                FilteringTextInputFormatter
                                                    .allow(RegExp(r'^[0-9]+$'))
                                              ],
                                              decoration: InputDecoration(
                                                  contentPadding:
                                                      EdgeInsets.all(5),
                                                  focusedBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  enabledBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  border: InputBorder.none,
                                                  hintText: 'ความดัน'),
                                            ),
                                          ]),
                                          rowSpacer,
                                          TableRow(children: [
                                            Container(
                                                padding: EdgeInsets.fromLTRB(
                                                    0, 10, 0, 0),
                                                child: Text(
                                                  'อัตราหัวใจเต้น (bpm)',
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 18,
                                                  ),
                                                )),
                                            TextField(
                                              controller: _hearthRateController,
                                              enabled: _isEnable,
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                  color: setHealthColor(
                                                      "heartRate",
                                                      _hearthRateController
                                                          .text)),
                                              inputFormatters: <
                                                  TextInputFormatter>[
                                                FilteringTextInputFormatter
                                                    .allow(RegExp(r'^[0-9.]+$'))
                                              ],
                                              decoration: InputDecoration(
                                                  contentPadding:
                                                      EdgeInsets.all(5),
                                                  focusedBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  enabledBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  border: InputBorder.none,
                                                  hintText: 'อัตราหัวใจเต้น'),
                                            ),
                                          ]),
                                          rowSpacer,
                                          TableRow(children: [
                                            Container(
                                                padding: EdgeInsets.fromLTRB(
                                                    0, 10, 0, 0),
                                                child: Text(
                                                  'อุณหภูมิ (องศาเซลเซียส)',
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 18,
                                                  ),
                                                )),
                                            TextField(
                                              controller:
                                                  _temperatureController,
                                              enabled: _isEnable,
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                  color: setHealthColor(
                                                      "temperature",
                                                      _temperatureController
                                                          .text)),
                                              inputFormatters: <
                                                  TextInputFormatter>[
                                                FilteringTextInputFormatter
                                                    .allow(RegExp(r'^[0-9.]+$'))
                                              ],
                                              decoration: InputDecoration(
                                                  contentPadding:
                                                      EdgeInsets.all(5),
                                                  focusedBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  enabledBorder:
                                                      OutlineInputBorder(
                                                    borderSide: BorderSide(
                                                        color:
                                                            Color(0xFFBBC4CE),
                                                        width: 1),
                                                  ),
                                                  border: InputBorder.none,
                                                  hintText: 'อุณหภูมิ'),
                                            ),
                                          ]),
                                        ],
                                      ),
                                    ])),
                                Expanded(
                                    flex: 1,
                                    child: IconButton(
                                        icon: _isEnable
                                            ? Icon(Icons.close)
                                            : Icon(Icons.edit),
                                        onPressed: () {
                                          setState(() {
                                            updateEnable();
                                          });
                                        }))
                              ]),
                          SizedBox(height: 10),
                          Visibility(
                              visible: _isEnable,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  primary: Colors.blue,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(18.0),
                                  ),
                                ),
                                onPressed: () {
                                  updateHealth();
                                  setState(() {
                                    updateEnable();
                                  });
                                },
                                child: const Text('อัพเดท',
                                    style: TextStyle(
                                      fontSize: 16,
                                    )),
                              )),
                        ]);
                      } else {
                        return Center(child: CircularProgressIndicator());
                      }
                    }),
                width: double.infinity,
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Colors.white,
                    border: Border.all(
                      color: Colors.grey,
                      style: BorderStyle.solid,
                      width: 1,
                    ))),
            SizedBox(
              height: 20,
            ),
            Container(
              margin: EdgeInsets.only(left: 20, right: 20),
              child: ButtonTheme(
                minWidth: double.infinity,
                child: RaisedButton(
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18.0),
                        side: BorderSide(color: Color(0xffFCBC66))),
                    padding: EdgeInsets.only(
                        left: 20, right: 20, top: 15, bottom: 15),
                    color: Color(0xffFCBC66),
                    child: const Text('นับลูกดื้น',
                        style: TextStyle(fontSize: 16, color: Colors.white)),
                    onPressed: () {
                      Navigator.push(
                          context,
                          PageTransition(
                              type: PageTransitionType.fade,
                              child: SquirmScreen()));
                    }),
              ),
            ),
          ],
        );
      } else {
        return Center(child: CircularProgressIndicator());
      }
    });
  }
}
