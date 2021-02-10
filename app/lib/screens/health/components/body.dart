import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/screens/squirm/squirm_screen.dart';

class Body extends StatefulWidget {
  Body({Key key}) : super(key: key);
  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  bool _change = false;
  final data = TextEditingController(text: 'ยอดเยี่ยม');
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
                child: Table(
                  children: [
                    TableRow(children: [
                      Text(
                        'สุขภาพ',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      TextField(
                          // onChanged: (String value) {
                          //   _change = true;
                          // },
                          style: TextStyle(
                            height: 0.5,
                          ),
                          controller: data,
                          decoration: InputDecoration(
                            border: InputBorder.none,
                          )),
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text(
                        'ส่วนสูง',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      Row(children: <Widget>[
                        Expanded(
                            child: TextField(
                                onChanged: (String value) {
                                  _change = true;
                                },
                                style: TextStyle(
                                  height: 0.5,
                                ),
                                controller: dataH,
                                decoration: InputDecoration(
                                  border: InputBorder.none,
                                ))),
                        Expanded(
                            child: Text('ซม.',
                                style: TextStyle(
                                  height: 0.25,
                                ))),
                      ])
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text(
                        'น้ำหนัก',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      Row(children: <Widget>[
                        Expanded(
                            child: TextField(
                                // onChanged: (String value) {
                                //   _change = true;
                                // },
                                style: TextStyle(
                                  height: 0.5,
                                ),
                                controller: dataW,
                                decoration: InputDecoration(
                                  border: InputBorder.none,
                                ))),
                        Expanded(
                            child: Text('กก.',
                                style: TextStyle(
                                  height: 0.25,
                                ))),
                      ])
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text(
                        'กรุ๊ปเลือด',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      TextField(
                          // onChanged: (String value) {
                          //   _change = true;
                          // },
                          style: TextStyle(
                            height: 0.5,
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
                          height: 2.2,
                        ),
                      ),
                      TextField(
                          // onChanged: (String value) {
                          //   _change = true;
                          // },
                          style: TextStyle(
                            height: 0.5,
                          ),
                          controller: dataP,
                          decoration: InputDecoration(
                            border: InputBorder.none,
                          )),
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text(
                        'อัตราการเต้นของหัวใจ',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      Row(children: <Widget>[
                        Expanded(
                            child: TextField(
                                // onChanged: (String value) {
                                //   _change = true;
                                // },
                                style: TextStyle(
                                  height: 0.5,
                                ),
                                controller: dataHR,
                                decoration: InputDecoration(
                                  border: InputBorder.none,
                                ))),
                        Expanded(
                            child: Text('bpm',
                                style: TextStyle(
                                  height: 0.25,
                                ))),
                      ])
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text(
                        'อุณหภูมิ',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      Row(children: <Widget>[
                        Expanded(
                            child: TextField(
                                // onChanged: (String value) {
                                //   _change = true;
                                // },
                                style: TextStyle(
                                  height: 0.5,
                                ),
                                controller: dataT,
                                decoration: InputDecoration(
                                  border: InputBorder.none,
                                ))),
                        Expanded(
                            child: Text('องศาเซลเซียส',
                                style: TextStyle(
                                  height: 0.25,
                                ))),
                      ])
                    ])
                  ],
                ),
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
                        side: BorderSide(color: Color(0xff0c96e4))),
                    padding: EdgeInsets.only(
                        left: 20, right: 20, top: 15, bottom: 15),
                    color: Color(0xff0c96e4),
                    child: const Text('นับลูกดื้น',
                        style: TextStyle(fontSize: 16, color: Colors.white)),
                    onPressed: () {
                      Navigator.push(context, SquirmScreen.route());
                    }),
              ),
            )
            RaisedButton(
              color: _change ? Colors.blue : Colors.grey,
              onPressed: _change
                  ? () {
                      print(data.text);
                      print(dataH.text);
                      print(dataW.text);
                      print(dataB.text);
                      print(dataP.text);
                      print(dataHR.text);
                      print(dataT.text);
                      print(_change);
                    }
                  : () {
                      print('disable');
                      print(_change);
                    },
              child: const Text('อัพเดท', style: TextStyle(fontSize: 14)),
            ),
          ],
        );
      } else {
        return Center(child: CircularProgressIndicator());
      }
    });
  }
}
