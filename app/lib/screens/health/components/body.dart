import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/screens/account/account_screen.dart';
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
    final response = await HttpClient.getWithoutDecode(path: '/health');
    return json.decode(response);
  }

  bool _change = true;
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
  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  updateHealth() async {
    // final regex = RegExp(r'^[0-9.]+$');
    // final bloodType = RegExp(r'^[ABCO+-]+$');
    // if (regex.hasMatch(_height) &&
    //     regex.hasMatch(_weight) &&
    //     bloodType.hasMatch(_bloodType) &&
    //     regex.hasMatch(_systolic) &&
    //     regex.hasMatch(_diastolic) &&
    //     regex.hasMatch(_hearthRate) &&
    //     regex.hasMatch(_temperature)) {
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
                        _height = hData['height'].toString();
                        _weight = hData['weight'].toString();
                        _bloodType = hData['bloodType'].toString();
                        _systolic = hData['systolic'].toString();
                        _diastolic = hData['diastolic'].toString();
                        _hearthRate = hData['hearthRate'].toString();
                        _temperature = hData['temperature'].toString();
                        _bmi = hData['BMI'].toString();
                        if (_height == null) {
                          _height = '-';
                        }
                        if (_weight == null) {
                          _weight = '-';
                        }
                        if (_bloodType == null) {
                          _bloodType = '-';
                        }
                        if (_systolic == null) {
                          _systolic = '-';
                        }
                        if (_diastolic == null) {
                          _diastolic = '-';
                        }
                        if (_hearthRate == null) {
                          _hearthRate = '-';
                        }
                        if (_temperature == null) {
                          _temperature = '-';
                        }
                        if (_bmi == null) {
                          _bmi = '-';
                        }
                        _heightController.text = _height;
                        _weightController.text = _weight;
                        _bloodTypeController.text = _bloodType;
                        _pressureController.text = "$_systolic/$_diastolic";
                        _hearthRateController.text = _hearthRate;
                        _temperatureController.text = _temperature;
                        return Column(children: [
                          Table(
                            columnWidths: {
                              0: FlexColumnWidth(6),
                              1: FlexColumnWidth(2),
                            },
                            children: [
                              TableRow(children: [
                                Container(
                                    padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                                    child: Text(
                                      'ส่วนสูง (ซม.)',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    )),
                                TextField(
                                  // onChanged: (String value) {
                                  //   _change = true;
                                  // },
                                  style: TextStyle(fontSize: 14),
                                  controller: _heightController,
                                  decoration: InputDecoration(
                                    border: InputBorder.none,
                                  ),
                                  inputFormatters: <TextInputFormatter>[
                                    FilteringTextInputFormatter.allow(
                                        RegExp(r'^[0-9.]+$'))
                                  ],
                                ),
                              ]),
                              rowSpacer,
                              TableRow(children: [
                                Container(
                                    padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                                    child: Text(
                                      'น้ำหนัก (กก.)',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    )),
                                TextField(
                                  // onChanged: (String value) {
                                  //   _change = true;
                                  // },
                                  style: TextStyle(
                                    fontSize: 14,
                                  ),
                                  controller: _weightController,
                                  decoration: InputDecoration(
                                    border: InputBorder.none,
                                  ),
                                  inputFormatters: <TextInputFormatter>[
                                    FilteringTextInputFormatter.allow(
                                        RegExp(r'^[0-9.]+$'))
                                  ],
                                ),
                              ]),
                              rowSpacer,
                              TableRow(children: [
                                Container(
                                    padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                                    child: Text(
                                      'กรุ๊ปเลือด',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    )),
                                TextField(
                                    // onChanged: (String value) {
                                    //   _change = true;
                                    // },
                                    style: TextStyle(
                                      fontSize: 14,
                                    ),
                                    controller: _bloodTypeController,
                                    decoration: InputDecoration(
                                      border: InputBorder.none,
                                    )),
                              ]),
                              rowSpacer,
                              TableRow(children: [
                                Container(
                                    padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                                    child: Text(
                                      'ความดัน',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    )),
                                TextField(
                                  // onChanged: (String value) {
                                  //   _change = true;
                                  // },
                                  style: TextStyle(
                                    fontSize: 14,
                                  ),
                                  controller: _pressureController,
                                  decoration: InputDecoration(
                                    border: InputBorder.none,
                                  ),
                                  inputFormatters: <TextInputFormatter>[
                                    FilteringTextInputFormatter.allow(
                                        RegExp(r'^[0-9]+$'))
                                  ],
                                ),
                              ]),
                              rowSpacer,
                              TableRow(children: [
                                Container(
                                    padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                                    child: Text(
                                      'อัตราการเต้นของหัวใจ (bpm)',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    )),
                                TextField(
                                  // onChanged: (String value) {
                                  //   _change = true;
                                  // },
                                  style: TextStyle(
                                    fontSize: 14,
                                  ),
                                  controller: _hearthRateController,
                                  decoration: InputDecoration(
                                    border: InputBorder.none,
                                  ),
                                  inputFormatters: <TextInputFormatter>[
                                    FilteringTextInputFormatter.allow(
                                        RegExp(r'^[0-9]+$'))
                                  ],
                                ),
                              ]),
                              rowSpacer,
                              TableRow(children: [
                                Container(
                                    padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                                    child: Text(
                                      'อุณหภูมิ (องศาเซลเซียส)',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    )),
                                TextField(
                                  // onChanged: (String value) {
                                  //   _change = true;
                                  // },
                                  style: TextStyle(
                                    fontSize: 14,
                                  ),
                                  controller: _temperatureController,
                                  decoration: InputDecoration(
                                    border: InputBorder.none,
                                  ),
                                  inputFormatters: <TextInputFormatter>[
                                    FilteringTextInputFormatter.allow(
                                        RegExp(r'^[0-9.]+$'))
                                  ],
                                ),
                              ])
                            ],
                          ),
                          RaisedButton(
                            color: _change ? Colors.grey : Colors.grey,
                            onPressed: updateHealth,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(18.0),
                            ),
                            // _updateHealth([this.data, this.dataH, this.dataT]),
                            child: Icon(Icons.update),
                          )
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
