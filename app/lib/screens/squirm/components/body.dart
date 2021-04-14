import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:intl/intl.dart';

class Body extends StatefulWidget {
  Body({Key key}) : super(key: key);
  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  String date = DateFormat('dd/MM/yyyy').format(new DateTime.now());

  Future<dynamic> fetchFetus() async {
    final response =
        await HttpClient.getWithoutDecode(path: "/fetus/group-by-date");
    return json.decode(response);
  }

  Future<dynamic> fetchBmi() async {
    final response =
        await HttpClient.getWithoutDecode(path: "/health/pregnant");
    return json.decode(response);
  }

  String _amount = '';
  String _weight = '';
  String _recommend = '';
  String _bmi = '';
  bool _isEnable = false;
  TextEditingController _amountController = TextEditingController();
  TextEditingController _weightController = TextEditingController();
  TextEditingController _pregnantHeightController = TextEditingController();
  TextEditingController _pregnantWeightController = TextEditingController();

  updateFetu() async {
    final regex = RegExp(r'^[0-9.]+$');
    if (regex.hasMatch(_amount) && regex.hasMatch(_weight)) {
      await HttpClient.post("/fetus", {"amount": _amount, "weight": _weight});
      setState(() {
        _weight = '';
        _weight = '';
        _amountController.text = '';
        _weightController.text = '';
      });
    }
  }

  updateBmi() async {
    final response = await HttpClient.put('/health', {
      "startPregnantHeight": _pregnantHeightController.text,
      "startPregnantWeight": _pregnantWeightController.text,
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
  }

  updateEnable() async {
    _isEnable ? _isEnable = false : _isEnable = true;
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      if (state.user != null) {
        return SingleChildScrollView(
            child: Column(
          children: [
            Container(
              padding: EdgeInsets.all(10),
              margin: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: Color(0xFFBBC4CE)),
                borderRadius: BorderRadius.circular(10),
              ),
              child: FutureBuilder<dynamic>(
                  future: fetchBmi(),
                  builder: (BuildContext context, AsyncSnapshot snapshot) {
                    if (snapshot.hasData) {
                      final hData = snapshot.data;
                      hData['startPregnantHeight'] == null
                          ? _pregnantHeightController.text = ''
                          : _pregnantHeightController.text =
                              hData['startPregnantHeight'].toString();
                      hData['startPregnantWeight'] == null
                          ? _pregnantWeightController.text = ''
                          : _pregnantWeightController.text =
                              hData['startPregnantWeight'].toString();
                      hData['BMI'] == null
                          ? _bmi = ''
                          : _bmi = hData['BMI'].toStringAsFixed(2);
                      hData['recommend'] == null
                          ? _recommend = ''
                          : _recommend = hData['recommend'].toString();
                      return Column(children: [
                        Row(children: [
                          new Spacer(),
                          Text(
                            'ค่าดัชนีมวลกายหลังเริ่มตั้งครรภ์',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 20.0,
                            ),
                          ),
                          IconButton(
                              icon: _isEnable
                                  ? Icon(Icons.close)
                                  : Icon(Icons.edit),
                              onPressed: () {
                                setState(() {
                                  updateEnable();
                                });
                              }),
                        ]),
                        SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            Flexible(
                                child: Text(
                              'ส่วนสูง(เซนติเมตร)',
                            )),
                            Flexible(
                                child: Text(
                              'น้ำหนัก(กิโลกรัม)',
                              textAlign: TextAlign.center,
                            )),
                          ],
                        ),
                        Row(
                          children: [
                            Flexible(
                              child: TextField(
                                controller: _pregnantHeightController,
                                enabled: _isEnable,
                                textAlign: TextAlign.center,
                                inputFormatters: <TextInputFormatter>[
                                  FilteringTextInputFormatter.allow(
                                      RegExp(r'^[0-9.]+$'))
                                ],
                                decoration: InputDecoration(
                                    contentPadding: EdgeInsets.all(5),
                                    focusedBorder: OutlineInputBorder(
                                      borderSide: BorderSide(
                                          color: Color(0xFFBBC4CE), width: 1),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderSide: BorderSide(
                                          color: Color(0xFFBBC4CE), width: 1),
                                    ),
                                    border: InputBorder.none,
                                    hintText: 'ส่วนสูง'),
                              ),
                            ),
                            Expanded(
                                child: Padding(
                              padding: EdgeInsets.only(left: 20),
                              child: TextField(
                                controller: _pregnantWeightController,
                                enabled: _isEnable,
                                textAlign: TextAlign.center,
                                inputFormatters: <TextInputFormatter>[
                                  FilteringTextInputFormatter.allow(
                                      RegExp(r'^[0-9.]+$'))
                                ],
                                decoration: InputDecoration(
                                    contentPadding: EdgeInsets.all(5),
                                    focusedBorder: OutlineInputBorder(
                                      borderSide: BorderSide(
                                          color: Color(0xFFBBC4CE), width: 1),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderSide: BorderSide(
                                          color: Color(0xFFBBC4CE), width: 1),
                                    ),
                                    border: InputBorder.none,
                                    hintText: 'น้ำหนัก'),
                              ),
                            )),
                          ],
                        ),
                        Visibility(
                            visible: _isEnable,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                primary: Colors.blue,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(18.0),
                                ),
                              ),
                              // _updateHealth([this.data, this.dataH, this.dataT]),
                              onPressed: () {
                                updateBmi();
                                setState(() {
                                  updateEnable();
                                });
                              },
                              child: const Text('อัพเดท',
                                  style: TextStyle(
                                    fontSize: 16,
                                  )),
                            )),
                        Visibility(
                            visible: !_isEnable,
                            child: Column(children: [
                              Text('ค่าดัชนีมวลกาย = $_bmi'),
                              Text('$_recommend'),
                              Text('*คำแนะนำสำหรับลูกเดี่ยวเท่านั้น')
                            ]))
                      ]);
                    } else {
                      return Center(child: CircularProgressIndicator());
                    }
                  }),
            ),
            Container(
              padding: EdgeInsets.all(20),
              margin: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: Color(0xFFBBC4CE)),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                children: [
                  Text(
                    'วันที่ : $date',
                    style: TextStyle(
                      fontSize: 20.0,
                    ),
                  ),
                  SizedBox(height: 10),
                  Row(
                    children: [
                      Flexible(
                        child: TextField(
                          controller: _amountController,
                          onChanged: (text) {
                            setState(() {
                              _amount = text;
                            });
                          },
                          keyboardType: TextInputType.number,
                          textAlign: TextAlign.center,
                          decoration: InputDecoration(
                              contentPadding: EdgeInsets.all(5),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                    color: Color(0xFFBBC4CE), width: 1),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                    color: Color(0xFFBBC4CE), width: 1),
                              ),
                              border: InputBorder.none,
                              hintText: 'จำนวนครั้งที่ลูกดื้น'),
                        ),
                      ),
                      SizedBox(width: 20),
                      Flexible(
                        child: TextField(
                          controller: _weightController,
                          keyboardType: TextInputType.number,
                          onChanged: (text) {
                            setState(() {
                              _weight = text;
                            });
                          },
                          textAlign: TextAlign.center,
                          decoration: InputDecoration(
                              contentPadding: EdgeInsets.all(5),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                    color: Color(0xFFBBC4CE), width: 1),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                    color: Color(0xFFBBC4CE), width: 1),
                              ),
                              border: InputBorder.none,
                              hintText: 'น้ำหนัก'),
                        ),
                      ),
                    ],
                  ),
                  MaterialButton(
                    onPressed: () {
                      this.updateFetu();
                    },
                    color: Colors.blue,
                    textColor: Colors.white,
                    child: Text('+',
                        style: TextStyle(fontSize: 20, color: Colors.white)),
                    padding: EdgeInsets.all(10),
                    shape: CircleBorder(),
                  ),
                ],
              ),
            ),
            Container(
              margin: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: Color(0xFFBBC4CE)),
              ),
              child: FutureBuilder<dynamic>(
                  future: fetchFetus(),
                  builder: (BuildContext context, AsyncSnapshot snapshot) {
                    if (snapshot.hasData) {
                      final fetusData = snapshot.data;
                      List<Map<String, dynamic>> show = [];
                      for (var fdata in fetusData) {
                        show.add({
                          "date": fdata["date"],
                          "amount": fdata["amount"],
                          "weight": fdata["weight"]
                        });
                      }
                      return DataTable(
                        columnSpacing: 30,
                        headingRowColor: MaterialStateColor.resolveWith(
                            (states) => Color(0xff98d583)),
                        columns: const <DataColumn>[
                          DataColumn(
                            label: Text(
                              'วันที่',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'จำนวนครั้งที่ดิ้น',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'น้ำหนักเฉลี่ย',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                        rows: show.map(
                          (fdata) {
                            return DataRow(
                                color: MaterialStateColor.resolveWith((states) {
                                  return Colors.white;
                                }),
                                cells: <DataCell>[
                                  DataCell(Text(fdata['date'],
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontSize: 14,
                                      ))),
                                  DataCell(Text('${fdata['amount']}',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontSize: 14,
                                      ))),
                                  DataCell(Text('${fdata['weight']}',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontSize: 14,
                                      )))
                                ]);
                          },
                        ).toList(),
                      );
                    } else {
                      return Center(child: CircularProgressIndicator());
                    }
                  }),
            ),
          ],
        ));
      } else {
        return Center(child: CircularProgressIndicator());
      }
    });
  }
}
