import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/screens/account/account_screen.dart';
import 'package:healthcare_app/screens/squirm/squirm_screen.dart';
// import 'package:healthcare_app/utils/index.dart';
import 'package:page_transition/page_transition.dart';

class Body extends StatefulWidget {
  Body({Key key}) : super(key: key);
  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  // Future<dynamic> fetchHealth() async {
  //   final response =
  //       await HttpClient.get(path: '/user/me/health);
  //   return response;
  // }

  // _updateHealth(context) async {
  //   final response = await HttpClient.post('/user/me/health', {
  //     "height": this.dataH,
  //     "weight": this.dataW,
  //     "blood": this.dataB,
  //     "pressure": this.dataP,
  //     "heartrate": this.dataHR,
  //     "temp": this.dataT,
  //   });
  //   if (response.containsKey("statusCode") && response["statusCode"] != 200) {
  //     return showDialog(
  //         context: context,
  //         builder: (context) {
  //           return AlertDialog(
  //             title: Text('Error'),
  //             content: Text(response["message"]),
  //           );
  //         });
  //   } else {
  //     return showDialog(
  //         context: context,
  //         builder: (context) {
  //           return AlertDialog(
  //             content: Text('กรุณาใส่ค่าให้ถูกต้อง'),
  //           );
  //         });
  //   }
  // }

  bool _change = true;
  final dataH = TextEditingController(text: '170');
  final dataW = TextEditingController(text: '53');
  final dataB = TextEditingController(text: 'A');
  final dataP = TextEditingController(text: '120/80');
  final dataHR = TextEditingController(text: '80');
  final dataT = TextEditingController(text: '36.7');
  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

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
                child: Column(children: [
                  Table(
                    columnWidths: {
                      0: FlexColumnWidth(6),
                      1: FlexColumnWidth(2),
                    },
                    children: [
                      TableRow(children: [
                        Text(
                          'ส่วนสูง (ซม.)',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        TextField(
                            onChanged: (String value) {
                              _change = true;
                            },
                            style: TextStyle(fontSize: 14),
                            controller: dataH,
                            decoration: InputDecoration(
                              border: InputBorder.none,
                            )),
                      ]),
                      rowSpacer,
                      TableRow(children: [
                        Text(
                          'น้ำหนัก (กก.)',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        TextField(
                            // onChanged: (String value) {
                            //   _change = true;
                            // },
                            style: TextStyle(
                              fontSize: 14,
                            ),
                            controller: dataW,
                            decoration: InputDecoration(
                              border: InputBorder.none,
                            )),
                      ]),
                      rowSpacer,
                      TableRow(children: [
                        Text(
                          'กรุ๊ปเลือด',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        TextField(
                            // onChanged: (String value) {
                            //   _change = true;
                            // },
                            style: TextStyle(
                              fontSize: 14,
                            ),
                            controller: dataB,
                            decoration: InputDecoration(
                              border: InputBorder.none,
                            )),
                      ]),
                      rowSpacer,
                      TableRow(children: [
                        Text(
                          'ความดัน',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        TextField(
                            // onChanged: (String value) {
                            //   _change = true;
                            // },
                            style: TextStyle(
                              fontSize: 14,
                            ),
                            controller: dataP,
                            decoration: InputDecoration(
                              border: InputBorder.none,
                            )),
                      ]),
                      rowSpacer,
                      TableRow(children: [
                        Text(
                          'อัตราการเต้นของหัวใจ (bpm)',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        TextField(
                            // onChanged: (String value) {
                            //   _change = true;
                            // },
                            style: TextStyle(
                              fontSize: 14,
                            ),
                            controller: dataHR,
                            decoration: InputDecoration(
                              border: InputBorder.none,
                            )),
                      ]),
                      rowSpacer,
                      TableRow(children: [
                        Text(
                          'อุณหภูมิ (องศาเซลเซียส)',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        TextField(
                            // onChanged: (String value) {
                            //   _change = true;
                            // },
                            style: TextStyle(
                              fontSize: 14,
                            ),
                            controller: dataT,
                            decoration: InputDecoration(
                              border: InputBorder.none,
                            )),
                      ])
                    ],
                  ),
                  RaisedButton(
                    color: _change ? Colors.grey : Colors.grey,
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                            builder: (context) => AccountScreen()),
                      );
                    },
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18.0),
                    ),
                    // _updateHealth([this.data, this.dataH, this.dataT]),
                    child: Icon(Icons.update),
                  )
                ]),
                width: double.infinity,
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Colors.white,
                    border: Border.all(
                      color: Colors.grey,
                      style: BorderStyle.solid,
                      width: 1,
                    ))),
            Container(
              margin: EdgeInsets.only(left: 20, right: 20),
              child: ButtonTheme(
                minWidth: double.infinity,
                child: RaisedButton(
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18.0),
                        side: BorderSide(color: Color(0xff8DC6BF))),
                    padding: EdgeInsets.only(
                        left: 20, right: 20, top: 15, bottom: 15),
                    color: Color(0xff8DC6BF),
                    child: const Text('คำนวนสุขภาพเบื้องต้น',
                        style: TextStyle(fontSize: 16, color: Colors.white)),
                    onPressed: () {
                      showDialog(
                          context: context,
                          child: AlertDialog(
                              title: const Text("สุขภาพเบื้องต้น",
                                  style: TextStyle(
                                    fontSize: 26,
                                    fontWeight: FontWeight.bold,
                                  )),
                              content: Table(columnWidths: {
                                0: FlexColumnWidth(3),
                                1: FlexColumnWidth(2),
                                2: FlexColumnWidth(3),
                              }, children: [
                                TableRow(children: [
                                  Padding(
                                    padding: EdgeInsets.symmetric(vertical: 10),
                                    child: Text(
                                      'ค่าดัชนีมวลกาย',
                                      style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  Text(''),
                                  Padding(
                                    padding: EdgeInsets.symmetric(vertical: 10),
                                    child: Text(
                                      'ผอม',
                                      style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.normal),
                                    ),
                                  ),
                                ]),
                                TableRow(children: [
                                  Padding(
                                    padding: EdgeInsets.symmetric(vertical: 10),
                                    child: Text(
                                      'ความดัน',
                                      style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  Text(''),
                                  Padding(
                                    padding: EdgeInsets.symmetric(vertical: 10),
                                    child: Text(
                                      'ปกติ',
                                      style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.normal),
                                    ),
                                  ),
                                ]),
                                TableRow(children: [
                                  Padding(
                                    padding: EdgeInsets.symmetric(vertical: 10),
                                    child: Text(
                                      'อัตราการเต้นของหัวใจ',
                                      style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  Text(''),
                                  Padding(
                                    padding: EdgeInsets.symmetric(vertical: 10),
                                    child: Text(
                                      'ปกติ',
                                      style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.normal),
                                    ),
                                  ),
                                ]),
                                TableRow(children: [
                                  Padding(
                                    padding: EdgeInsets.symmetric(vertical: 10),
                                    child: Text(
                                      'อุณหภูมิ',
                                      style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  Text(''),
                                  Padding(
                                    padding: EdgeInsets.symmetric(vertical: 10),
                                    child: Text(
                                      'ปกติ',
                                      style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.normal),
                                    ),
                                  ),
                                ]),
                              ])));
                    }),
              ),
            ),
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
