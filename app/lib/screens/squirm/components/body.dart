import 'dart:convert';

import 'package:flutter/material.dart';
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
    final response = await HttpClient.getWithoutDecode(path: "/health");
    return json.decode(response);
  }

  String _amount = '';
  String _weight = '';
  TextEditingController _amountController = TextEditingController();
  TextEditingController _weightController = TextEditingController();
  TextEditingController _pregnantBMIController = TextEditingController();

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
      "pregnantBMI": _pregnantBMIController.text,
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

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      if (state.user != null) {
        return SingleChildScrollView(
            child: Column(
          children: [
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
                  SizedBox(height: 20),
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
                  SizedBox(height: 20),
                  MaterialButton(
                    onPressed: () {
                      this.updateFetu();
                    },
                    color: Colors.blue,
                    textColor: Colors.white,
                    child: Text('+',
                        style: TextStyle(fontSize: 36, color: Colors.white)),
                    padding: EdgeInsets.all(10),
                    shape: CircleBorder(),
                  ),
                ],
              ),
            ),
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: Color(0xFFBBC4CE)),
                borderRadius: BorderRadius.circular(10),
              ),
              child: FutureBuilder<dynamic>(
                  future: fetchFetus(),
                  builder: (BuildContext context, AsyncSnapshot snapshot) {
                    if (snapshot.hasData) {
                      final fetusData = snapshot.data;
                      List<Map<String, dynamic>> show = new List();
                      for (var fdata in fetusData) {
                        show.add({
                          "date": fdata["date"],
                          "amount": fdata["amount"],
                          "weight": fdata["weight"]
                        });
                      }
                      return DataTable(
                        headingRowColor: MaterialStateColor.resolveWith(
                            (states) => Color(0xff98d583)),
                        columns: const <DataColumn>[
                          DataColumn(
                            label: Text(
                              'วันที่',
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'จำนวนครั้งที่ดิ้น',
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'น้ำหนักเฉลี่ย',
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
                                        fontSize: 16,
                                      ))),
                                  DataCell(Text('${fdata['amount']}',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontSize: 16,
                                      ))),
                                  DataCell(Text('${fdata['weight']}',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontSize: 16,
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
            Container(
              padding: EdgeInsets.all(10),
              margin: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.grey,
                border: Border.all(color: Color(0xFFBBC4CE)),
                borderRadius: BorderRadius.circular(10),
              ),
              child: FutureBuilder<dynamic>(
                  future: fetchBmi(),
                  builder: (BuildContext context, AsyncSnapshot snapshot) {
                    if (snapshot.hasData) {
                      final hData = snapshot.data;
                      if (hData['pregnantBMI'] == null) {
                        _pregnantBMIController.text = '';
                      } else {
                        _pregnantBMIController.text =
                            hData['pregnantBMI'].toString();
                      }
                      return Row(
                        children: [
                          Text('ค่าดัชนีมวลกายหลังเริ่มตั้งครรภ์'),
                          Expanded(
                              child: Padding(
                            padding: EdgeInsets.only(left: 20),
                            child: TextField(
                              controller: _pregnantBMIController,
                              decoration: const InputDecoration(
                                hintText: 'ค่า bmi',
                              ),
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 14, // This is not so important
                              ),
                            ),
                          )),
                          ButtonTheme(
                              minWidth: 30.0,
                              height: 30.0,
                              child: RaisedButton(
                                color: Colors.grey[300],
                                onPressed: updateBmi,
                                shape: CircleBorder(),
                                // _updateHealth([this.data, this.dataH, this.dataT]),
                                child: Icon(Icons.update),
                              )),
                        ],
                      );
                    } else {
                      return Center(child: CircularProgressIndicator());
                    }
                  }),
            )
          ],
        ));
      } else {
        return Center(child: CircularProgressIndicator());
      }
    });
  }
}
